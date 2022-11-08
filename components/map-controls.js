import { useControl } from "react-map-gl"
//import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client'


class HelloWorldControl {

  constructor(onClickFun, enableCacheRangeFun) {
    this._onClick = onClickFun;
    this._enableCacheRange = enableCacheRangeFun;
  }

  onAdd(map) {

    this._map = map;
    this._container = document.createElement('div');
    const fragment = (
      <div className="border-solid border-2 border-slate-400 p-1 rounded-sm bg-white m-2 pointer-events-auto">
        <div className="text-base font-bold border-b-2 mb-2">
          Controls
        </div>
        <div>
          <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 pointer-events-auto" onClick={this._onClick}>Re-Center</button>
        </div>
        <div className="my-2">
          <label for="default-toggle" className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" value="" id="default-toggle" className="sr-only peer" onChange={this._enableCacheRange} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <div className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Cache Range</div>
          </label>
        </div>
      </div>
    )
    this._root = createRoot(this._container);
    this._root.render(fragment);
    return this._container;
  }

  onRemove() {
    this._root.unmount();
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

export default function MapControls(props) {

  const controlMap = (
    <>
      <div>
        this is a test
      </div>
    </>
  )
  console.log(controlMap);

  useControl(() => new HelloWorldControl(props.onClick, props.enableCacheRange), {
    position: props.position
  });

  return null
}