<?php

$pointer = fopen('data.json', 'r');
if(flock($pointer, LOCK_SH)){ // will block execution until the write lock is released
    $content = fread($pointer, filesize('data.json')); // will return the correct content
    clearstatcache('data.json'); // clear the file cache for the next function
    $size = filesize('data.json'); // will return the correct size
}
fclose($pointer);
$array = json_decode($content, true);

if (!$array || $content=="")
{    
    $array = json_decode('{"reload":"reload","fire":"fire", "color": "color"}', true);
}

// herladen
if (isset($_GET['reload']))
{
    $array["reload"] = $_GET['reload'];
}

// schieten
if (isset($_GET['fire']))
{
    $array["fire"] = $_GET['fire'];
}

//kleur
if (isset($_GET['color']))
{
    $array["color"] = $_GET['color'];
}

if (isset($_GET['reset']))
{
    $array["reset"] = $_GET['reset'];
}
$result = file_put_contents("data.json", json_encode($array), LOCK_EX);
