class ScrollBar extends Component {
    static labelNo = 0;
    static instances:{[key: string]: ScrollBar;} = {};
    static activeInstances:{[key: string]: ScrollBar;} = {};
    static defaults:{[key: string]: any;} = {barSize: 15, offset:0, scrollMultiplier:5}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label"],
        boolean : ["isHor"],
        //DisplayGroup : ["parentDisplayGroup"],
    }
    static ScrollBar_whiteBG = css("whiteBG","background-color:white;outline: 1px solid black;outline-offset: -1px;", {type:"llm"});
    static ScrollBar_blackBG = css("blackBG","background-color:black;color:white;cursor: -webkit-grab; cursor: grab;", {type:"llm"});   

// arrows  //scrollArrows
    static scrollArrowsSVGCss = css(`scrollArrows`,`stroke: black;`,`fill: white;`, {type:"llm"});
    static arrowSVGCss = css(`arrowIcon`,`stroke: black;cursor:pointer;`,`fill: white;`, {type:"llm"});
    static leftArrowSVG(classname:string) {return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
      <path transform="rotate(182.31 12.399 12.341)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
      </svg>`;}
    static rightArrowSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
      <path transform="rotate(2.382 1.0017 36.146)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
      </svg>`;}
    static upArrowSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
      <path transform="rotate(-87.663 12.607 12.106)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
      </svg>`;}
    static downArrowSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
      <path transform="rotate(92.906 12.406 12.398)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
      </svg>`;}
    static startoffset:number;
    node:node_;
    parentDisplayCell:DisplayCell;
    totalPixels:number;
    viewingPixels:number;
    scrollbarDisplayCell:DisplayCell;
    preBar: DisplayCell;
    Bar: DisplayCell;
    postBar: DisplayCell;
    isHor:boolean;
    barSize:number;
    pixelsUsed:number;
    pixelsAvailable:number;
    offset:number;
    scrollMultiplier:number;

    get scrollbarPixels() {
      let coord = this.scrollbarDisplayCell.coord;
      return (this.isHor) ? coord.width - this.barSize*2 : coord.height - this.barSize*2}
    get ratio(){
      return pf.decimalPlaces(this.pixelsUsed/this.scrollbarPixels , 3);
    }
    update(pixelsUsed:number, pixelsAvailable:number): number {
      this.pixelsUsed=pixelsUsed;
      this.pixelsAvailable=pixelsAvailable;
      this.limit();
      return this.offset;
    }
    limit(){
      if (this.offset < 0) this.offset = 0;
      if (this.offset > this.pixelsUsed-this.pixelsAvailable) this.offset = this.pixelsUsed-this.pixelsAvailable;
    }
    // retArgs:objectAny;   // <- this will appear
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        ScrollBar.makeLabel(this); ScrollBar.instances[this.label] = this;
        this.build();
        ScrollBar.instances[this.label] = this;
    }
    onConnect():void{
      this.preRender(undefined, undefined);
      Render.scheduleUpdate();
    };
    preRender(derender:boolean, node:node_):void{
      if (this.isHor) this.parentDisplayCell.coord.height -= this.barSize;
      else this.parentDisplayCell.coord.width -= this.barSize;
      
      return undefined
      };
    Render(derender:boolean, node:node_, zindex:number):Component[]{
      // console.log("Scrollbar Render");
      let coord = this.parentDisplayCell.coord;
      let x = (this.isHor) ? coord.x : coord.x + coord.width;
      let y = (this.isHor) ? coord.y + coord.height : coord.y;
      let width = (this.isHor) ? coord.width : this.barSize;
      let height = (this.isHor) ? this.barSize : coord.height;
      this.scrollbarDisplayCell.coord.assign(x, y, width, height, x, y, width, height, zindex);
      

      this.preBar.dim = `${this.offset/this.ratio}px`;
      this.Bar.dim = `${this.scrollbarPixels*this.pixelsAvailable/this.pixelsUsed - 1}px`;
      this.postBar.dim = `100%`;

      return [this.scrollbarDisplayCell]
    };
    delete(){
      Render.update(this.scrollbarDisplayCell, true);
      Render.scheduleUpdate();
    }
    build(){
        let label = this.label + ((this.isHor) ? "_H" : "_V");
        this.preBar = I(`${label}_preBar`,  ScrollBar.ScrollBar_whiteBG, events({onclick:this.onSmallerBar.bind(this)}));
        this.Bar = I(`${label}_Bar`, ScrollBar.ScrollBar_blackBG, events({ondrag:[this.onBarDown.bind(this), this.onBarMove.bind(this)]}));
        this.postBar = I(`${label}_postBar`, ScrollBar.ScrollBar_whiteBG, events({onclick:this.onBiggerBar.bind(this)}));
        this.scrollbarDisplayCell =
        h(`${label}_h`,  this.isHor,
            I(`${label}_backArrow`,`${this.barSize}px`,
                 (this.isHor) ? ScrollBar.leftArrowSVG("scrollArrows") : ScrollBar.upArrowSVG("scrollArrows"),
                 events({onholdclick:[this.onSmallArrow.bind(this)]})
            ),
            this.preBar,this.Bar,this.postBar,
            I(`${label}_forwardArrow`,`${this.barSize}px`,
                 (this.isHor) ? ScrollBar.rightArrowSVG("scrollArrows") : ScrollBar.downArrowSVG("scrollArrows"),
                 events({onholdclick:[this.onBigArrow.bind(this)]})
            ),
        );
    }
    onSmallArrow(e:PointerEvent){this.offset -= this.ratio*this.scrollMultiplier;
      this.limit();Render.scheduleUpdate();}
    onBigArrow(e:PointerEvent){this.offset += this.ratio*this.scrollMultiplier;
      this.limit();Render.scheduleUpdate();}
    onSmallerBar(e:PointerEvent){this.offset -= this.pixelsAvailable;
      this.limit();Render.scheduleUpdate();}
    onBiggerBar(e:PointerEvent){this.offset += this.pixelsAvailable;
      this.limit();Render.scheduleUpdate();}
    onBarDown(e:MouseEvent){ScrollBar.startoffset = this.offset;}
    onBarMove(e:MouseEvent, xmouseDiff:object){
        let dist = (this.isHor) ? xmouseDiff["x"] : xmouseDiff["y"];
        this.offset = ScrollBar.startoffset + dist*this.ratio;
        this.limit();
        Render.scheduleUpdate();
     }
}
Render.register("ScrollBar", ScrollBar);
function scrollbar(...Arguments:any):ScrollBar {
    return new ScrollBar(...Arguments)
}

class onDrag_ extends Base {
  static instances:onDrag_[] = [];
  static activeInstances:onDrag_[] = [];
  static defaults = {}
  static argMap = {
      string : ["label"],
      function : ["onDown", "onMove", "onUp"],
  }
  label:string;
  el: HTMLDivElement;
  onDown: Function = function(){};
  onMove: Function = function(){};
  onUp: Function = function(){};
  isDown:boolean = false;
  mousePos:object;
  mouseDiff:object;

  returnObject:object;

  constructor(...Arguments: any) {
      super();this.buildBase(...Arguments);
      if ("Array" in this.retArgs) {
          let array=this.retArgs["Array"][0];
          let num = array.length;
          if (num > 0) this.onDown = array[0];
          if (num > 1) this.onMove = array[1];
          if (num > 2) this.onUp = array[2];
      }
      let THIS = this;
      onDrag_.makeLabel(this);
      this.returnObject = {
          onmousedown:  function(e:MouseEvent){
              THIS.onDown(e);
              THIS.isDown = true;
              THIS.mousePos = { x: e.clientX, y: e.clientY };
              window.addEventListener('selectstart', onDrag_.disableSelect);
              window.onmousemove = <any>FunctionStack.push(window.onmousemove,      
                  function onDragMove (e:MouseEvent){
                      THIS.mouseDiff = {x: e.clientX - THIS.mousePos["x"], y: e.clientY - THIS.mousePos["y"]}
                      THIS.onMove(e, THIS.mouseDiff);
                  }
              );
              window.onmouseup = <any>FunctionStack.push(window.onmouseup,       
                  function onDragUp(e:MouseEvent){
                      THIS.reset();
                      THIS.onUp(e, THIS.mouseDiff);
                  }
              );
          }
      }
  }
  reset(){
      FunctionStack.pop(<any>(window.onmousemove), "onDragMove");
      FunctionStack.pop(<any>(window.onmouseup), "onDragUp");
      window.removeEventListener('selectstart', onDrag_.disableSelect);
      this.isDown = false;
  }
  static disableSelect(event:MouseEvent) {event.preventDefault();}
}
function onDrag(...Arguments:any){return (new onDrag_(...Arguments)).returnObject;}
Element_.customEvents["ondrag"] = function(newData:any){ return onDrag(newData); }

class onHoldClick_ extends Base {
  static labelNo = 0;
  static instances:{[key: string]: onHoldClick_;} = {};
  static activeInstances:{[key: string]: onHoldClick_;} = {};
  static defaults:{[key: string]: any;} = {initialDelay:1000, repeatDelay:75}
  static argMap:{[key: string]: Array<string>;} = {
      string : ["label"],
      number : ["initialDelay", "repeatDelay"],
      function : ["FUNCTION"],
  }
  // retArgs:objectAny;   // <- this will appear
  label:string;
  initialDelay:number;
  repeatDelay:number;
  FUNCTION:Function;
  returnObject:object;
  isDown:number;

  timeDown:number;
  mouseDownEvent:PointerEvent;

  constructor(...Arguments:any){
      super();this.buildBase(...Arguments);
      onHoldClick_.makeLabel(this); onHoldClick_.instances[this.label] = this;
      let THIS = this;
      this.returnObject = {
          onmousedown:  function(e:PointerEvent){
              THIS.mouseDownEvent = e;
              THIS.onDown(e);
              THIS.isDown = new Date().getTime();
              window.onmouseup = <any>FunctionStack.push(window.onmouseup,       
                  function onHoldClickUp(e:MouseEvent){
                      //console.log("mouseUp");
                      FunctionStack.pop(<any>(window.onmouseup), "onHoldClickUp");
                      THIS.isDown = undefined;
                  }
              );
              setTimeout(() => {
                  let newTime = new Date().getTime();
                  // console.log("ok",newTime - THIS.isDown, THIS.initialDelay)
                  if (THIS.isDown && (newTime - THIS.isDown) >= THIS.initialDelay) {
                      THIS.repeat();
                  }
              }, THIS.initialDelay);
          }
      }
  }
  repeat(){let THIS = this;this.FUNCTION(this.mouseDownEvent);
      setTimeout(() => {if (THIS.isDown) THIS.repeat()}, THIS.repeatDelay);}
  onDown(e:MouseEvent){this.FUNCTION(e);}
}
function onHoldClick(...Arguments:any){return (new onHoldClick_(...Arguments)).returnObject;}
Element_.customEvents["onholdclick"] = function(newData:any[]){ return onHoldClick(...newData); }


