<?php
spl_autoload_register(function ($class_name) {
    include $class_name . '.php';
});
class UssdTree{
	private $address;
	private $treeMenu=array();
	private $ready=false;
	
	function isReady(){
		return $this->ready;
	}
	function setReady($ready){
		$this->ready=$ready;
	}
	function __construct($treeHeader,$address){
		$this->address=$address;
		$node=new UssdNode($treeHeader,'root','0');
		$node->setAddress($address);
		$this->treeMenu['root']=$node;
	}
	function addNode($nodes){
		if(!empty($nodes)){
			if(is_array($nodes)){
				foreach($nodes as $node){
					$node->setAddress($this->address);
					$this->treeMenu[$node->getName()]=$node;
					$parent=$node->getParent();
					if(array_key_exists($parent,$this->treeMenu)){
						$this->treeMenu[$parent]->addChild($node->getName());
					}
				}
			}
			else{
					$nodes->setAddress($this->address);
					$this->treeMenu[$nodes->getName()]=$nodes;
					$parent=$nodes->getParent();
					if(array_key_exists($parent,$this->treeMenu)){
						$this->treeMenu[$parent]->addChild($nodes->getName());
					}
			}
		}
	}
	function getNode($name){
		$node=$this->treeMenu[$name];
		return $node;
	}
}
?>