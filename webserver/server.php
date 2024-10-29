#!/usr/local/bin/php -q

<?php
error_reporting(E_ALL);

/* Allow the script to hang around waiting for connections. */
set_time_limit(0);

/* Turn on implicit output flushing so we see what we're getting
 * as it comes in. */
ob_implicit_flush();

function socket_setup($address, $port) {
    if (($socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) === false) {
        echo "socket_create() failed: " . socket_strerror(socket_last_error()) . "\n";
    }

    // bind to port and address
    if (socket_bind($socket, $address, $port) === false) {
        echo "socket_bind() failed: reason: " . socket_strerror(socket_last_error($socket)) . "\n";
    }
    
    // set to listen
    if (socket_listen($socket, 5) === false) {
        echo "socket_listen() failed: reason: " . socket_strerror(socket_last_error($socket)) . "\n";
    }

    return $socket;
}

function http_response($path_to_html) {
    $content = file_get_contents($path_to_html);

    $response = "HTTP/1.1 200 OK\r\n";
    $response .= "Content-Type: text/html; charset=UTF-8\r\n";
    $response .= "Content-Length: " . strlen($content);
    $response .= "Connection: close\r\n\r\n";
    $response .= $content;

    return $response;
}

function parse_http_request($request) {
    $lines = explode("\r\n", $request);
    $request_line = explode(" ", $lines[0]);

    return array(
        "method" => $request_line[0],
        "uri" => $request_line[1],
    );
}

function run_server($socket) {
    while (true) {
        $client_socket = socket_accept($socket);
        if ($client_socket === false) {
            echo "socket_accept() failed: " . socket_strerror(socket_last_error($client_socket)) . "\n";
            return;
        }

        if (false === ($request = socket_read($client_socket, 2048))) {
            echo "socket_read() failed: reason: " . socket_strerror(socket_last_error($client_socket)) . "\n";
        }

        $data = parse_http_request($request);

        echo "[CLIENT] REQUEST " . $data["method"] . " " . $data["uri"] . "\n";

        if ($data["method"] == "GET") {
            $server_files = scandir("./views");
            $file_found = false;
            if ($data["uri"] == "/") {
                foreach ($server_files as &$file) {
                    $file_elements = explode(".", $file);
                    if ($file_elements[0] == "index") {
                        $response = http_response("./views/" . $file);

                        socket_write($client_socket, $response, strlen($response));
                        echo "[SERVER] RESPONSE GET" . $data["uri"] . ": 200\n";
                        $file_found = true;
                    }
                }
                if ($file_found === false) {
                    $response = http_response("./views/404.html");
                    socket_write($client_socket, $response, strlen($response));
                    echo "[SERVER] RESPONSE GET" . $data["uri"] . ": 404\n";
                }
            }
            else {
                $target = explode("/", $data["uri"]);
                foreach ($server_files as &$file) {
                    if ($file == $target[1]) {
                        $response = http_response("./views/" . $file);
                        socket_write($client_socket, $response, strlen($response));
                        echo "[SERVER] RESPONSE GET" . $data["uri"] . ": 200\n";
                        $file_found = true;
                    }
                }
                if ($file_found === false) {
                    $response = http_response("./views/404.html");
                    socket_write($client_socket, $response, strlen($response));
                    echo "[SERVER] RESPONSE GET" . $data["uri"] . ": 404\n";
                }
            }
        }
    
        socket_close($client_socket);
    }
}

$address = "localhost";
$port = "8080";

$server_socket = socket_setup($address, $port);
echo "Running Server on http://$address:$port\n";
run_server($server_socket);


// Close Server
socket_close($server_socket);
