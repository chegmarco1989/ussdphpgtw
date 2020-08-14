<?php
include('ussdmenu-server-php/UssdReceiver.php');

include('MyTree.php');
ini_set("display_errors", false);
error_reporting(E_ALL);
session_start();


class MyUssdReceiver extends UssdReceiver{
	private static $receiver;
	public function getAppShortCode(){
		return '*142#';
	}
	public function getUssdTree($address){
		return new MyTree('Welcome to USSD Server',$address);
	}
	function __construct(){
		
	}
	public static function init(){
		if(empty(self::$receiver)){
			$receiver=new MyUssdReceiver();
			self::$receiver=$receiver;
		}
	}
	public static function process($request){
		return self::$receiver->onMessage($request);
	}
}

MyUssdReceiver::init();
$msisdn=$_POST['msisdn'];
$message=$_POST['message'];
$request=array('msisdn'=>$msisdn,'message'=>$message,'transactionId'=>'1234567');
$response=MyUssdReceiver::process($request);
echo $response['message'];
//var_dump($response);



?>