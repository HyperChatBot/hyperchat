export default `
以下是一个基本的 React 拖放组件示例：

\`\`\`
import React, {useState} from 'react';

const DragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [items, setItems] = useState([
    {id: 'item-1', text: 'Item 1'},
    {id: 'item-2', text: 'Item 2'},
    {id: 'item-3', text: 'Item 3'},
  ]);

  const onDragStart = (event, id) => {
    setIsDragging(true);
    setDraggedItem(id);
    event.dataTransfer.setData('text/html', event.target.parentNode);
    event.dataTransfer.effectAllowed = 'move';
    event.target.parentNode.classList.add('dragging');
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const dragOverItem = event.target.parentNode;
    const itemsCopy = [...items];
    const draggedItemIndex = items.findIndex(item => item.id === draggedItem);
    const dragOverIndex = items.findIndex(item => item.id === dragOverItem.id);
    itemsCopy.splice(draggedItemIndex, 1);
    itemsCopy.splice(dragOverIndex, 0, items[draggedItemIndex]);
    setItems(itemsCopy);
    setDraggedItem(itemsCopy[dragOverIndex].id);
  };

  const onDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
    const draggingItem = document.querySelector('.dragging');
    draggingItem.classList.remove('dragging');
  };

  return (
    <div className="drag-and-drop">
      {items.map(item => (
        <div
          className={\`item \${isDragging && draggedItem === item.id ? 'dragging' : ''}\`}
          draggable
          onDragStart={event => onDragStart(event, item.id)}
          onDragOver={event => onDragOver(event)}
          onDragEnd={onDragEnd}
          key={item.id}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default DragAndDrop;
\`\`\`

使用说明：

- 组件的状态 useState()负责管理拖放事件的标记和数据。
- onDragStart()方法会触发在拖动物品时进行的动作。
- onDragOver()方法会在拖动的物品悬停在可放置区域时触发，并告诉浏览器将物品放置到该所在项中。
- onDragEnd()方法在拖放操作结束时触发，它将清除有关拖放操作的数据。

需要注意的是，我们需要用\`.preventDefault()\`方法以及\`.dataTransfer.setData()\`和\`.dataTransfer.effectAllowed\`属性来使拖放事件正常进行。此外，我们需要为每个拖动的物品设置一个唯一的 id，以便在进行拖放操作时可以正确地识别它们。
`
