var nums=new Array();
var score=0;

$(function(){
	newGame();	
});

function newGame(){
	init();//初始化
	generateNumber();//在随机的两个格子中产生随机数(2或4)
	generateNumber();
}

function init(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css("top",getPosTop(i));
			gridCell.css("left",getPosLeft(j));
		}
	}

	for(var i=0;i<4;i++){
		nums[i]=new Array();
		for(var j=0;j<4;j++){
			nums[i][j]=0;//数组初始化
		}
	}
	upDateView();//更新页面视图，刷新上层视图的16个单元格
}

function upDateView(){
	$(".number-cell").remove();

	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid-container").append("<div class='number-cell' id='number-cell-"+i+"-"+j+"''></div>");
			var numberCell=$("#number-cell-"+i+"-"+j);
			$("#number-cell-"+i+"-"+j).attr("flag","true");
			if(nums[i][j]!=0){
				numberCell.css("top",getPosTop(i));
				numberCell.css("left",getPosLeft(j));
				numberCell.css("width","100px");
				numberCell.css("height","100px");
				numberCell.css("background-color",getNumberBackgroundColor(nums[i][j]));
				numberCell.css("color",getNumberColor(nums[i][j]));
				numberCell.text(nums[i][j]);
			}else{
				numberCell.css("width","0px");
				numberCell.css("height","0px");
				numberCell.css("top",getPosTop(i)+50);
				numberCell.css("left",getPosLeft(j)+50);
			}			
		}
	}	
}

function generateNumber(){
	if(noSpace()){
		return;
	}
	var temp=new Array();
	// for(var i=0;i<4;i++){
	// 	for(var j=0;j<4;j++){
	// 		if(nums[i][j]==0){
	// 			temp.push(i*4+j);
	// 		}
	// 	}
	// }
	// var pos=Math.floor(Math.random()*(temp.length));
	// var x=Math.floor(temp[pos]/4);
	// var y=Math.floor(temp[pos]%4);

	// var randNumber=Math.random()>0.5?2:4;
	// nums[x][y]=randNumber;
	// showNumberWithAnimation(x,y,randNumber)

	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(nums[i][j]==0){
				temp.push(i+"-"+j);
			}
		}
	}
	var pos=Math.floor(Math.random()*(temp.length));//[0,6)
	var x=temp[pos].slice(0,1);
	var y=temp[pos].slice(2);

	var randNumber=Math.random()>0.5?2:4;//随机一个数字
	nums[x][y]=randNumber;
	showNumberWithAnimation(x,y,randNumber)
	setTimeout(isGameOver(nums),500);
}

//实现键盘响应
$(document).keydown(function(event){
	event.preventDefault();
	switch(event.keyCode){
		case 37://left
			if(canMoveLeft(nums)){
				moveLeft();				
				setTimeout(generateNumber,200);
			}
			break;
		case 38://up
			if(canMoveUp(nums)){
				moveUp();
				setTimeout(generateNumber,200);
			}
			break;
		case 39://right
			if(canMoveRight(nums)){
				moveRight();
				setTimeout(generateNumber,200);				
			}
			break;
		case 40://down
			if(canMoveDown(nums)){
				moveDown();
				setTimeout(generateNumber,200);				
			}
			break;
	}
});
/*
	向左移动
	需要对每一个数字的左边进行判断，选择落脚点，落脚点有两种情况：
	1.落脚点没有数字，并且移动路径中没有障碍物
	2.落脚点数字和自己相等，并且移动路径中没有障碍物 
*/
function moveLeft(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(nums[i][j]!=0){
				for(var k=0;k<j;k++){//从最左边开始遍历左边所有的元素，进行判断
					if(nums[i][k]==0&&noBlockHorizontal(i,k,j,nums)){//第i行的第k-j列之间是否有障碍物
						showMoveAnimation(i,j,i,k); //显示移动的动画效果
						nums[i][k]=nums[i][j];//从i,j位置移动到i,k位置
						nums[i][j]=0;//将原来的位置设置为0
						break;//一旦有合适的落脚点，则停止查找
					}else if($("#number-cell-"+i+"-"+k).attr("flag")=="true"&&nums[i][k]==nums[i][j]&&noBlockHorizontal(i,k,j,nums)){
						showMoveAnimation(i,j,i,k);//显示移动的动画效果
						nums[i][k]+=nums[i][j];
						$("#score").html(Number($("#score").html())+nums[i][k]);						
						$("#number-cell-"+i+"-"+k).attr("flag","false");
						nums[i][j]=0;
						break;
					}
				}
			}
		}
	}
	setTimeout(upDateView,200);//等待200ms，让移动的动画效果显示完，再更新
	//更新页面上层的16个单元格，将原来的删除，重新添加，此处才是真正的更新显示移动后的结果
}

// 向右移动
function moveRight(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(nums[i][j]!=0){
				for(var k=3;k>j;k--){
					if(nums[i][k]==0&&noBlockHorizontal(i,j,k,nums)){
						showMoveAnimation(i,j,i,k); 
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if($("#number-cell-"+i+"-"+k).attr("flag")=="true"&&nums[i][k]==nums[i][j]&&noBlockHorizontal(i,j,k,nums)){
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];
						$("#score").html(Number($("#score").html())+nums[i][k]);
						$("#number-cell-"+i+"-"+k).attr("flag","false");
						nums[i][j]=0;
						break;
					}
				}
			}
		}
	}
	setTimeout(upDateView,200);
}

// 向上移动
function moveUp(){
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(nums[i][j]!=0){
				for(var k=0;k<i;k++){
					if(nums[k][j]==0&&noBlockVertical(j,k,i,nums)){
						showMoveAnimation(i,j,k,j); 
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if($("#number-cell-"+k+"-"+j).attr("flag")=="true"&&nums[k][j]==nums[i][j]&&noBlockVertical(j,k,i,nums)){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];
						$("#score").html(Number($("#score").html())+nums[k][j]);
						$("#number-cell-"+k+"-"+j).attr("flag","false");
						nums[i][j]=0;
						break;
					}
				}
			}
		}
	}
	setTimeout(upDateView,200);
}

// 向下移动
function moveDown(){
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(nums[i][j]!=0){
				for(var k=3;k>i;k--){
					var numberCell=$("#number-cell-"+k+"-"+j);
					if(nums[k][j]==0&&noBlockVertical(j,i,k,nums)){
						showMoveAnimation(i,j,k,j); 
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if($("#number-cell-"+k+"-"+j).attr("flag")=="true"&&nums[k][j]==nums[i][j]&&noBlockVertical(j,i,k,nums)){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];
						$("#score").html(Number($("#score").html())+nums[k][j]);
						$("#number-cell-"+k+"-"+j).attr("flag","false");
						nums[i][j]=0;
						break;
					}
				}
			}
		}
	}
	setTimeout(upDateView,200);
}









