<?php

$db=mysql_connect('localhost','u349367176_user','123321');

if(!$db){die("Cant connect to phpMyAdmin");}
if(!mysql_select_db('u349367176_dizel',$db)) die('Cannot connect to datebase');

$categoryName=$_POST['categoryName'];

$categorys = mysql_query("SELECT * FROM `category` WHERE Parent='".$categoryName."'");
$Details = mysql_query("SELECT * FROM `Details` WHERE Parent='".$categoryName."'");
$resultDetail = array();
while($var = mysql_fetch_row($Details)) array_push($resultDetail, $var);

$resultCategory = array();
while($var = mysql_fetch_row($categorys)) array_push($resultCategory, $var[3]);

$result=array();
array_push($result, $resultCategory);
array_push($result, $resultDetail);

echo json_encode($result);
?>