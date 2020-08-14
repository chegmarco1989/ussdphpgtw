<?php
class UssdUserSession{
	private $currentNode;
	private $index;
	private $myTree;
	private $stack=array();
	private $userData=array();
	function __construct(){
		
	}
	function getCurrentNode(){
		return $this->currentNode;
	}
	function setCurrentNode($node){
		$this->currentNode=$node;
	}
	function getDisplayedLength(){
		return count($this->currentNode->getChildren());
	}
	function getMyTree(){
		return $this->myTree;
	}
	function getNode($name){
		return $this->myTree->getNode($name);
	}
	function setMyTree($tree){
		$this->myTree=$tree;
	}
	function getAllUserData(){
		return $this->userData;
	}
	function setIndex($ind){
		$this->index=$ind;
	}
	function changeNode($node){
		$this->setIndex(0);
		$currName=$this->currentNode->getName();
		$this->stack[]=$currName;
		$newNode=$this->myTree->getNode($node);
		if(count($newNode->getChildren())==1){
			$newNode=$this->myTree->getNode($newNode->getChildren()[0]);
		}
		$this->currentNode=$newNode;
	}
	function loadPrevNode(){
		$this->currentNode=$this->myTree->getNode(array_pop($this->stack));
		$this->currentNode->setIndex(0);
		$this->setIndex(0);
	}
	function fetchDisplay(){
		return $this->currentNode->toString();
	}
	function addData($key,$value){
		$this->userData[$key]=$value;
	}
	function getData($key){
		return $this->userData[$key];
	}
	function initUser($myTree){
		$this->setMyTree($myTree);
		$this->currentNode=$this->myTree->getNode('root');
	}
}
?>