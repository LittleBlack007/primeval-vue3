export default {
  // 指令所在组件VNode 及其 Vnode前部更新后调用
  mounted(el){
    // 创建一个容器，获取该组件内的内容
    //const currentStyle = window.getComputedStyle(el, ''); // 获取当前元素的style
    const textSpan = document.createElement('span');  // 创建一个容器记录文字的宽度
    //textSpan.style = currentStyle;
    document.body.appendChild(textSpan); // 插入body中，获取offsetWidth

    // 设置新容器的文字
    textSpan.innerHTML = el.innerHTML;
    const realWidth = textSpan.offsetWidth;
    // 过河拆桥 把用来度量长度的textSpan从body中移除
    document.body.removeChild(textSpan);
    
    if(realWidth > el.offsetWidth){  // 文字有被隐藏（文字真正宽度 大于 当前容器的宽度）
      // 给当前元素设置超出隐藏
      el.style.overflow = 'hidden';
      el.style.textOverflow = 'ellipsis';
      el.style.whiteSpace = 'nowrap';
    }
    showTooltip(el);
  },
  unmounted(){  // 指令与元素解绑时
    const tooltipBoxDom = document.getElementById('tooltip-box');
    tooltipBoxDom && document.body.removeChild(tooltipBoxDom);
  },
}

function showTooltip(el){
  let tooltipLeaveIs = Symbol('tooltipLeaveIs');
  // 鼠标移入计算是否 展示全部文字内容
  el.onmouseenter = e => {
    el[tooltipLeaveIs] = false;
    // 创建一个容器，获取该组件内的内容
    // const currentStyle = window.getComputedStyle(el, ''); // 获取当前元素的style
    const box = document.createElement('div');  // 创建一个容器记录文字的宽度
    // box.style = currentStyle;
    document.body.appendChild(box); // 插入body中，获取offsetWidth

    // 设置新容器的文字
    //box.innerHTML = el.innerHTML;
    const realWidth = box.offsetWidth;
    // 过河拆桥 把用来度量长度的textSpan从body中移除
    document.body.removeChild(box);
    
    if(realWidth > el.offsetWidth){  // 文字有被隐藏（文字真正宽度 大于 当前容器的宽度）
      // 给当前元素设置超出隐藏
      el.style.overflow = 'hidden';
      el.style.textOverflow = 'ellipsis';
      el.style.whiteSpace = 'nowrap';

      const tooltipBox = document.createElement('div');
      tooltipBox.style.cssText = `
        max-width: 400px;
        position: absolute;
        top: ${e.pageY + 5}px;
        left: ${e.pageX}px;
        padding: 4px;
        color: #fff;
        background: rgba(0,0,0,0.6);
        border-radius: 5px;
        z-index: 9999
      `;

      tooltipBox.onmouseenter = () => {  // 实现停留内容时不删除tooltip
        el[tooltipLeaveIs] = false;
      }
      tooltipBox.onmouseleave = () => {  // 实现停留内容时不删除tooltip
        el[tooltipLeaveIs] = true;
        setTimeout(() => {
          if(el[tooltipLeaveIs]){
            const tooltipBoxDom = document.getElementById('tooltip-box');
            tooltipBoxDom && document.body.removeChild(tooltipBoxDom);
          }
        },500)
      }
      const tooltipBoxDom = document.getElementById('tooltip-box');
      tooltipBoxDom && document.body.removeChild(tooltipBoxDom);
      tooltipBox.setAttribute('id','tooltip-box');// 设置id方便寻找
      document.body.appendChild(tooltipBox);  // 添加到body中
      document.getElementById('tooltip-box').innerHTML = el.innerHTML;
    }

    // 鼠标移出 删除全部内容
    el.onmouseleave = () => {
      el[tooltipLeaveIs] = true;
      setTimeout(() => {
        if(el[tooltipLeaveIs]){
          const tooltipBoxDom = document.getElementById('tooltip-box');
          tooltipBoxDom && document.body.removeChild(tooltipBoxDom);
        }
      },500)
      
    }
  }
}