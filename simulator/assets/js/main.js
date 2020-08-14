	var number="";
	var sessionId="";
	var callBack="";
	var buttons=selectorAll(".row button");
	var input=selector(".input")
	var loader=selector(".loading")
	var keyboard=selector(".keyboard");
	var ussdResult=selector(".result")
	var mode="keyboard";
	var resultInput=selector(".resultInput");
	var textOutput=selector(".textOutput");
	var homePage=selector(".iconsPage");
	var ussdPage=selector(".ussd");

	selector(".delete").addEventListener("click",()=>{
		remove(1)
	})
	selector(".resend").addEventListener("click",()=>{
		resend()
	})
	function goHome(){
		homePage.style.display="block";
		ussdPage.style.display="none";
	}
	function goUssd(){
		homePage.style.display="none";
		ussdPage.style.display="block";
	}

	for(var a=0;a<buttons.length;a++){ 
		buttons[a].addEventListener("click",(ele)=>{
			var target = ele.explicitOriginalTarget || ele.target || ele.originalTarget;
			var data=target.childNodes[0].data.trim();
			if(data==="."){
				sendUssd(input.value);
				return;
			}
			if(mode==="keyboard"){
				input.value=input.value+""+data;
			}else{
				resultInput.value=resultInput.value+""+data;
			}
		 
		})
	}
	

	function remove(len){
		 if(mode==="keyboard"){
		 	var data=input.value;
			data=data.substring(0,(data.length-len));
			input.value=data;
		 }else{
		 	var data=resultInput.value;
			data=data.substring(0,(data.length-len));
			resultInput.value=data;
		 }

	}
	function resend(){
		var data=input.value;
		data=data.replace("#","*");

		newData=resultInput.value;
		if(newData.trim()===null || newData.trim()===""){
			return;
		}
		resultInput.value="";
		data=data+""+newData+"#";
		input.value=data;
		
		sendUssd(data)

	}
	function resultInputsVis(state){
		if(state)
			selector(".resultInputs").style.display="block"
		else
			selector(".resultInputs").style.display="none"

	}
	function sendUssd(data){
		var array=data.split("*");
		array.shift();
		array.shift();
		

		var first=data.substring(0,1);
		var last=data.substring(data.length-1,data.length);

		if(localStorage.getItem("ussdData")!==undefined && localStorage.getItem("ussdData")!==null){
			data=array.join("*");
			data=data.substring(0,data.length-1);
			var ussdData=JSON.parse(localStorage.getItem("ussdData"))
			if(first==="*" || first==="#" && last ==="#"){
				loading(1)
				ussdResultWithoutKeyboard()
				msg("Sending the ussd");
				var url=ussdData.url+"?phone="+ussdData.phone+"&sessionId="+ussdData.sessionId+"&code="+ussdData.code;
				url+="&text="+data;
				setTimeout(()=>{
					loadWeb(url).then((output)=>{
						if(output.indexOf("1.")!==-1){
							if(output.indexOf("CON")!==-1){
								output=output.replace(/CON/g,"")
							}
							output=output.replace(/\n/g,"<br />")
							resultInputsVis(1);
							setOutput(output)
							showResult();
						}else if(output.indexOf("END")!==-1){
							// server doesn't still needs the commands from user
							output=output.replace(/END/g,"")
							output=output.replace(/\n/g,"<br />")
							resultInputsVis(0);
							setOutput(output)
							showResult();
							var outEle=selector(".result")
							var button=document.createElement("button")
							button.innerHTML="OK";
							button.classList.add("endSession");
							button.addEventListener("click",()=>{
								button.remove();
								onlyKeyBoardMode()
							})
							outEle.appendChild(button)
						}else{
							output=output.replace(/\n/g,"<br />")
							resultInputsVis(0);
							// setOutput("Server is not responding well")
							setOutput(output)
							showResult();
							var outEle=selector(".result")
							var button=document.createElement("button")
							button.innerHTML="OK";
							button.classList.add("endSession");
							button.addEventListener("click",()=>{
								button.remove();
								onlyKeyBoardMode()
							})
							outEle.appendChild(button)
						}						
						loading(0)
					}).catch((error)=>{
						loading(0)
						onlyKeyBoardMode()
						msg(error)
						showError("There were an error!!! "+error.status);
					})
				},1000)
			}else{
				msg("pls use correct format of ussd")
				showError("Please use correct format of ussd")
			}	
		}else{
			showError("Please first save the datas");
		}
			
	}
	var loadWeb=(url)=>{
		return new Promise((resolve,reject)=>{
			var xmlhttp = new XMLHttpRequest();
	        xmlhttp.onreadystatechange = function() {
	            if (this.readyState == 4 && this.status == 200) {
	                resolve(this.responseText)
	            }
	            if (this.readyState == 4 && this.status !== 200) {
	                reject({"status":this.status,"response":this.responseText})
	            }
	        };
	        xmlhttp.open("GET", url, true);
	        xmlhttp.send();
		})
	}
	function showError(data){
		var alertMsg=selector(".alertMsg").style;
		var p= selector(".alertMsg p");
		p.innerHTML=data;
		alertMsg.display="block"
		setTimeout(()=>{
			alertMsg.display="none";
		},5000)
		msg(data)
	}
	function setOutput(data){
		textOutput.innerHTML=data;
	}
	function showResult(){
		selector(".result").style.display="block";
	}

	selector(".resultInput").addEventListener("focus",resultInputFocus)

	function resultInputFocus(){
		selector(".result").style.top="10px"
		ussdResultWithKeyboard();
	}
	function ussdResultWithoutKeyboard(){

		typing(0,1)
		selector(".result").style.top="50px"
		msg("ussdResultWithoutKeyboard")
	}

	function ussdResultWithKeyboard(){
		typing(1,2)

		msg("ussd Result With Keyboard")
	}

	selector(".cancel").addEventListener("click",()=>{

		onlyKeyBoardMode();
	})

	function onlyKeyBoardMode(){
		closeUssdResult();
		typing(1,1)
		input.value="";
		msg("onlyKeyBoardMode");
	}
	function closeUssdResult(){
		selector(".result").style.display="none";
	}

	function loading(state){
		if(state===1){
			closeUssdResult()
			loader.style.display="block";
		}else{
			loader.style.display="none";
		}
	}
	function msg(message){
		//console.log(message);
	}

	function selector(element){
		return document.querySelector(element);
	}
	function selectorAll(element){
		return document.querySelectorAll(element);
	}

	function typing(state,version){
		if(version===1){
			mode="keyboard";
			selector(".input").style.display="block";
			selector(".send").style.display="block";
			if(state===1){
				keyboard.style.display="block";
			}else{
				keyboard.style.display="none";
			}
			
		}else if(version===2){
			mode="onlyKeyboard";
			selector(".input").style.display="none";
			selector(".send").style.display="none";
			if(state===1){
				keyboard.style.display="block";
			}else{
				keyboard.style.display="none";
			}
			
		}
		
	}

	function clock(){
		var date=new Date();
		var hours=date.getHours();
		var munites=date.getMinutes();
		var seconds=date.getSeconds();
		var time=hours+":"+munites+":"+seconds;
		selector(".clock").innerHTML=time
	}

	setInterval(clock,1000);

		//settings js
		check();
		selector(".save").addEventListener("click",save)
		function save(){
			var phone=selector(".phoneNumber").value;
			var url=selector(".url").value;
			var code=selector(".code").value;
			var ussdData={
				phone:phone,
				url:url,
				code:code,
				sessionId:0
			}
			localStorage.setItem("ussdData",JSON.stringify(ussdData))
			selector(".alert").style.display="block"
			setTimeout(()=>{
				selector(".alert").style.display="none"
			},5000)
		}
		function check(){
			if(localStorage.getItem("ussdData")!==undefined && localStorage.getItem("ussdData")!==null){
				var ussdData=JSON.parse(localStorage.getItem("ussdData"))
				selector(".phoneNumber").value=(ussdData.phone);
				selector(".url").value=(ussdData.url);
				selector(".code").value=(ussdData.code);

			}
		}

		selector(".goSettings").addEventListener("click",()=>{

			selector(".tempCont").style.display="block";
		})
		selector(".goCodes").addEventListener("click",()=>{
			selector(".codes").style.display="block";

			selector(".tempCont").style.display="none";
		})
