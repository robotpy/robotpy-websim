export function removeDragSources(myLayout) {
  if (!myLayout || myLayout._dragSources.length === 0) {
    return;
  }

  myLayout._dragSources.forEach( function( dragSource ) {
    dragSource._dragListener.destroy();
    dragSource._element = null;
    dragSource._itemConfig = null;
    dragSource._dragListener = null;
  } );
  myLayout._dragSources = [];
}

export function removeDragSource(myLayout, tag) {
  let dragSource = getDragSourceByTag(myLayout, tag);
  
  if (!dragSource) {
    return;
  }

  dragSource._dragListener.destroy();
  dragSource._element = null;
  dragSource._itemConfig = null;
  dragSource._dragListener = null;

  let index = myLayout._dragSources.indexOf(dragSource);
  myLayout._dragSources.splice(index, 1);
}


export function createDragSource(myLayout, element, tagName) {
  myLayout.createDragSource(element, {
    type:'component',
    componentName: tagName,
    componentState: {}
  });
}

export function getDragSourceTags(myLayout) {
  return myLayout._dragSources.map((source) => {
    return source._itemConfig.componentName;
  });
}

export function hasDragSourceTag(myLayout, tag) {
  let dragSourceTags = getDragSourceTags(myLayout);
  return dragSourceTags.indexOf(tag) >= 0;
}

export function getDragSourceByTag(myLayout, tag) {
  for (let i = 0; i < myLayout._dragSources.length; i++) {
    let dragSource = myLayout._dragSources[i];
    if (dragSource._itemConfig.componentName === tag) {
      return dragSource;
    }
  }
  return null;
}

export function onDragStop(myLayout, tag, callback) {
  let dragSource = getDragSourceByTag(myLayout, tag);
  dragSource._dragListener.on('dragStop', callback, dragSource);
}

export function fixBrokenDragSource(myLayout, tag, element, callback) {
  let dragSource = getDragSourceByTag(myLayout, tag);

  if (dragSource && !dragSource._element.is(element)) {
    removeDragSource(myLayout, tag);
    createDragSource(myLayout, element, tag);
    onDragStop(myLayout, tag, callback);
  }
}