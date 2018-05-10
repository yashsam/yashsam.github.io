<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Authorize
{	
	function __construct()
	{
		$this->ci =& get_instance();
		//$this->ci->load->model('logging_model');
		//$this->ci->load->model('consumer_model');
		//$this->ci->load->model('merchant_model');
        //$this->ci->load->library('email');
        //$this->ci->load->library('tank_auth');
	}
	function authorize_merchant($username, $password)																					//1
	{
		$username = null;
		$password = null;

		// mod_php
		if (isset($_SERVER['PHP_AUTH_USER'])) {
			$username = $_SERVER['PHP_AUTH_USER'];
			$password = $_SERVER['PHP_AUTH_PW'];

		// most other servers
		} elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {

				if (strpos(strtolower($_SERVER['HTTP_AUTHORIZATION']),'basic')===0)
				  list($username,$password) = explode(':',base64_decode(substr($_SERVER['HTTP_AUTHORIZATION'], 6)));
		}
		if (is_null($username)) {
			// header('WWW-Authenticate: Basic realm="Shmart! Wallet"');
			// header('HTTP/1.0 401 Unauthorized');
			// echo 'Authorization required';
			// die();
			return 0;
		} else {
			return 1;
				/*$ip = $this->ci->input->ip_address();
		
				if($this->ci->merchant_model->getRestCredentials($username,$password,$ip))
				{
					return 1;
				} else {
					// header('WWW-Authenticate: Basic realm="My Realm"');
					// header('HTTP/1.0 401 Unauthorized');
					// echo 'Authorization failed';
					// die();
					return 0;
				}*/
		}
       
	}
}