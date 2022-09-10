import { useControl } from "react-map-gl"


class HelloWorldControl {
  
  constructor(onClickFun) {
    this._onClick = onClickFun;
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    //this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    var button = document.createElement('button');
    button.className = 'p-2 m-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 pointer-events-auto';
    button.type = 'button';
    button['aria-label'] = 'Zoom out';
    button.onclick = this._onClick;
    //var span = document.createElement('i');
    //span.className = 'fa-solid fa-arrow-left';
    button.textContent = 'Re-Center';
    this._container.appendChild(button);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

export default function BackControl(props) {
  useControl(() => new HelloWorldControl(props.onClick), {
    position: props.position
  });

  return null
}