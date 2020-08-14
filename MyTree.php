<?php
spl_autoload_register(function ($class_name) {
    include "ussdmenu-server-php/" . $class_name . '.php';
});
class MyTree extends UssdTree{
	function __construct($treeHeader,$address){
		parent::__construct($treeHeader,$address);
		$this->initTree();
		$this->setReady(true);
	}
	
	private function initTree(){
		$nodes=array();
		$nodes[]=new UssdNode("Send Money", "sendmoney", "root");
		$nodes[]=new UssdNode("Airtime/Data", "airtimedata", "root");
		$nodes[]=new UssdNode("Widthdraw Cash", "withdrawcash", "root");
		$nodes[]=new UssdNode("Pay Bill", "paybill", "root");  
		$nodes[]=new UssdNode("Buy Goods", "buygoods", "root");
		$nodes[]=new UssdNode("Check Balance", "checkbalance", "root");
		$nodes[]=new UssdNode("Financial Services", "financialservices", "root");
		$nodes[]=new UssdNode("My Account", "myaccount", "root");
		$nodes[]=new UssdNode("Messages", "messages", "root");
				
		$nodes[]=new UssdNode("UMEME touchpay", "umeme", "paybill");
		$nodes[]=new UssdNode("NWSC eWater", "nwsc", "paybill");
		$nodes[]=new UssdNode("Pay TV", "paytv", "paybill"); 
	
		$nodes[]=new UssdNode("Widthdraw Cash", "air timedata", "paytv");
		$nodes[]=new UssdNode("Buy Goods", "nws data", "paytv");
		$nodes[]=new UssdNode("My Account", "check balance", "paytv");		

		$this->addNode($nodes);
	}
}
?>