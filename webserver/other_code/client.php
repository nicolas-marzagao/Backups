#!/usr/local/bin/php -q
<?php

error_reporting(E_ALL);

/* Allow the script to hang around waiting for connections. */
set_time_limit(0);

/* Turn on implicit output flushing so we see what we're getting
 * as it comes in. */
ob_implicit_flush();

$server_address = "localhost";
$server_port = "8080";

$client_socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($client_socket === false) {
    echo "socket_create() has failed: " . socket_strerror(socket_last_error()) . "\n";
}

echo "Attempting to connect to '$server_address' on port '$server_port'...";

$result = socket_connect($client_socket, $server_address, $server_port);
if ($result === false) {
    echo "socket_connect() failed.\nReason: ($result) " . socket_strerror(socket_last_error($client_socket)) . "\n";
} else {
    echo "OK.\n";
}

$out = socket_read($client_socket, 2048);
    
echo $out;

sleep(60);

socket_close($client_socket);