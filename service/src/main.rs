use actix_cors::Cors;
use actix_web::{get, http::header, middleware, web, App, HttpRequest, HttpServer, Responder};
use actix_web_lab::sse;
use futures::StreamExt;
use rs_openai::{
    chat::{ChatCompletionMessageRequestBuilder, CreateChatRequestBuilder, Role},
    OpenAI,
};
use serde::Deserialize;
use serde_json::json;
use std::time::Duration;

#[derive(Debug, Deserialize)]
struct Params {
    q: String,
    user_id: String,
    api_key: String,
}

#[get("/create_chat")]
async fn create_chat(req: HttpRequest) -> impl Responder {
    let params = web::Query::<Params>::from_query(req.query_string()).unwrap();

    let (tx, rx) = sse::channel(1024);

    let client = OpenAI::new(&OpenAI {
        api_key: params.api_key.clone(),
        org_id: None,
    });

    let req = CreateChatRequestBuilder::default()
        .model("gpt-3.5-turbo")
        .messages(vec![ChatCompletionMessageRequestBuilder::default()
            .role(Role::User)
            .content(&params.q)
            .build()
            .unwrap()])
        .stream(true)
        .user(&params.user_id)
        .build()
        .unwrap();

    let mut count = 0;
    let mut stream = client.chat().create_with_stream(&req).await.unwrap();

    actix_web::rt::spawn(async move {
        while let Some(response) = stream.next().await {
            if let Ok(res) = response {
                let id = res.id;

                for choice in res.choices {
                    if let Some(content) = choice.delta.content {
                        count += 1;
                        let _ = tx
                            .send(
                                sse::Data::new(
                                    json! ({
                                        "q": &params.q,
                                        "a": content,
                                        "id": id
                                    })
                                    .to_string(),
                                )
                                .event("chat/completions")
                                .id(count.to_string()),
                            )
                            .await;
                    }
                }
            }
        }
    });

    rx.with_keep_alive(Duration::from_secs(5))
        .with_retry_duration(Duration::from_secs(5))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    log::info!("starting HTTP server at http://localhost:2996");

    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
                    .allowed_header(header::CONTENT_TYPE)
                    .supports_credentials()
                    .max_age(3600),
            )
            .wrap(middleware::Logger::default())
            .app_data(web::JsonConfig::default().limit(4096))
            .service(create_chat)
    })
    .bind(("127.0.0.1", 2996))?
    .run()
    .await
}
