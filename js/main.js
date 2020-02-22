var doc = document;

function getId(n) {
  return doc.getElementById(n);
}

//飞机移动
getId('wrapId').onmousemove = function (event) {
  //鼠标移动的当前位置-飞机在背景位置
  var eventLeft = event.pageX - getId('wrapId').offsetLeft - 20;
  var eventRight= event.pageY - getId('wrapId').offsetTop - 30;
  getId('planeId').style.left = eventLeft + 'px';
  getId('planeId').style.top = eventRight + 'px';
}

//生成目标，列表数据
function targetList() {
  var arrs = [];
  for(var i = 0;i < 10;i++) {
    var obj = {}
    //添加属性，10以内的数量
    obj.x = Math.floor(Math.random() * 10);
    obj.y = Math.floor(Math.random() * 10);
    arrs.push(obj)
  }
  createTarget(arrs)
}
targetList();

//生成单个目标
function createTarget(arrs) {
  for (var i = 0;i < arrs.length;i++) {
    //应该生成限定背景内
    var targetBlock = doc.createElement('li');
    targetBlock.setAttribute('class','targetDiv no_boom');
    targetBlock.style.left = arrs[i].x * 100 + 'px';
    getId('wrapId').appendChild(targetBlock)
  }
  //获取所有目标li标签
  var list = getId('wrapId').querySelectorAll('li');
  var n = 0;
  var _setTime = setInterval(() =>{
    for (var j = 0;j < list.length;j++) {
      list[j].style.top = (arrs[j].y++) * 10 + 'px';
      n++;
      if(n >1500) {
        clearInterval(_setTime);
        getId('wrapId').removeChild(list[j]);
      }
    }
  },150)
}

//生成子弹
function creatBullet(event) {
  //创建div
  var bullet = doc.createElement('div');
  bullet.style.left = event.pageX - getId('wrapId').offsetLeft + 35 + 'px';
  bullet.style.top = event.pageY - getId('wrapId').offsetTop - 80 + 'px';
   //将属性赋予子弹这个div
  bullet.setAttribute('class','bullet');
   //子弹添加入游戏背景区
  getId('wrapId').appendChild(bullet);
  //判断子弹与目标接触，即横向坐标中比较纵向
  //选出x轴所有目标
  var fireTarget_X = [];
  var list = getId('wrapId').querySelectorAll('li');
  for (var i = 0;i < list.length;i++) {
    if(bullet.offsetLeft > list[i].offsetLeft && bullet.offsetLeft < (list[i].offsetLeft + 60)) {
      fireTarget_X.push(list[i])
    }
  }


   //子弹消失，即子弹纵向坐标top值一直减为0，
  var n = bullet.offsetTop;
  //设置定时器
  var _setTime = setInterval(() =>{bullet.style.top = n-- + 'px';
  //判断是否击中,即x轴上是否有目标，数组长度fireTarget
    if(fireTarget_X.length >= 0) {
      for(var i = 0;i < fireTarget_X.length;i++) {
        //如果子弹top值n等于数组里的top值，即判断击中
        if(n == fireTarget_X[i].offsetTop && fireTarget_X[i].getAttribute('class') != 'targetDiv yes_boom'){
          fireTarget_X[i].setAttribute('class','targetDiv yes_boom');
          //清楚子弹计数器
          clearInterval(_setTime)
          var clearBullet = setTimeout(() => {
            getId('wrapId').removeChild(bullet);
            clearInterval(clearBullet)
          },100);
        }
      }
    }

  //未击中情况下，子弹抵达边界消失（添加的移除节点）
    if (n <= 0) {
      clearInterval(_setTime)
      getId('wrapId').removeChild(bullet)
    }
  },5)
}

//创建子弹射击事件
getId('wrapId').onclick = function (event) {
  creatBullet(event);
}