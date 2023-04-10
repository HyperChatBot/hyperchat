/// <reference types="vite/client" />

type SelectorMapper<Type> = {
    [Property in keyof Type]: Type[Property];
};