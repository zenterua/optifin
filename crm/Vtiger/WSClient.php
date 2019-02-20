<?php
/*+***********************************************************************************
 * The contents of this file are subject to the Vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  Vtiger CRM Open Source
 * The Initial Developer of the Original Code is Vtiger.
 * Portions created by Vtiger are Copyright (C) www.vtiger.com
 * All Rights Reserved.
 *************************************************************************************/
require 'HTTP_Client.php';
// require_once('WSVersion.php');

/**
 * Vtiger Webservice Client
 */
class Vtiger_WSClient {
	// Webserice file
	var $_servicebase = 'webservice.php';

	// HTTP Client instance
	var $_client = false;
	// Service URL to which client connects to
	var $_serviceurl = false;

	// Webservice user credentials
	var $_serviceuser= false;
	var $_servicekey = false;

	// Webservice login validity
	var $_servertime = false;
	var $_expiretime = false;
	var $_servicetoken=false;

	// Webservice login credentials
	var $_sessionid  = false;
	var $_userid     = false;

	// Last operation error information
	var $_lasterror  = false;

	/**
	 * Constructor.
	 */
	function __construct($url) {
		$this->_serviceurl = $this->getWebServiceURL($url);
		$this->_client = new Vtiger_HTTP_Client($this->_serviceurl);
	}

	/**
	 * Reinitialize the client.
	 */
	function reinitalize() {
		$this->_client = new Vtiger_HTTP_Client($this->_serviceurl);
	}

	/**
	 * Get the URL for sending webservice request.
	 */
	function getWebServiceURL($url) {
		if(stripos($url, $this->_servicebase) === false) {
			if(strripos($url, '/') != (strlen($url)-1)) {
				$url .= '/';
			}
			$url .= $this->_servicebase;
		}
		return $url;
	}

	/**
	 * Check if result has any error.
	 */
	function hasError($result) {
		if(isset($result['success']) && $result['success'] === true) {
			$this->_lasterror = false;
			return false;
		}
		$this->_lasterror = $result['error'];
		return true;
	}

	/**
	 * Get last operation error
	 */
	function lastError() {
		return $this->_lasterror;
	}

	/**
	 * Perform the challenge
	 * @access private
	 */
	function __doChallenge($username) {
		$getdata = Array(
			'operation' => 'getchallenge',
			'username'  => $username
		);
		$resultdata = $this->_client->doGet($getdata, true);

		if($this->hasError($resultdata)) {
			return false;
		}

		$this->_servertime   = $resultdata['result']['serverTime'];
		$this->_expiretime   = $resultdata['result']['expireTime'];
		$this->_servicetoken = $resultdata['result']['token'];
		return true;
	}

	/**
	 * JSONify input data.
	 */
	function toJSON($input) {
		return $this->_client->__jsondecode($input);
	}

	/**
	 * Convert input data to JSON String.
	 */
	function toJSONString($input) {
		return $this->_client->__jsonencode($input);
	}

	/**
	 * Do Login Operation
	 */
	function doLogin($username, $vtigerUserAccesskey) {
		// Do the challenge before login
		if($this->__doChallenge($username) === false) return false;

		$postdata = Array(
			'operation' => 'login',
			'username'  => $username,
			'accessKey' => md5($this->_servicetoken.$vtigerUserAccesskey)
		);
		$resultdata = $this->_client->doPost($postdata, true);

		if($this->hasError($resultdata)) {
			return false;
		}
		$this->_serviceuser = $username;
		$this->_servicekey  = $vtigerUserAccesskey;

		$this->_sessionid = $resultdata['result']['sessionName'];
		$this->_userid    = $resultdata['result']['userId'];
		return true;
	}

	/**
	 * Do Query Operation.
	 */
	function doQuery($query) {
		// Make sure the query ends with ;
		$query = trim($query);
		if(strripos($query, ';') != strlen($query)-1) $query .= ';';

		$getdata = Array(
			'operation' => 'query',
			'sessionName'  => $this->_sessionid,
			'query'  => $query
		);
		$resultdata = $this->_client->doGet($getdata, true);
		if($this->hasError($resultdata)) {
			return false;
		}
		return $resultdata['result'];
	}

	
}
?>
