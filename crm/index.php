<?php
define( 'DIR_PATH', getcwd() );
require_once('Vtiger/WSClient.php');

//get data from CRM
$username = 'dashboard';
$vtigerUserAccesskey = 'dyM4htRLxxb6WQh';

$vtiger = new Vtiger_WSClient('https://crmintern.optifin.at/');
$login = $vtiger->doLogin($username, $vtigerUserAccesskey);

$leads = $vtiger->doQuery('select * from Leads');

//Create array
$output_array = array();
if($leads and is_array($leads)){
	$i = 0;
	foreach ($leads as $lead) { $i++;
		// var_dump($lead);
		$createdtime = $lead['createdtime'];
		$timestamp = strtotime($createdtime);
		$year = date('Y', strtotime($createdtime));
		$month = date('m', strtotime($createdtime));
		$key = strtotime($year.'-'.$month.'-01 09:00:00');

		$output_array[$key]['year'] = $year;
		$output_array[$key]['month'] = $month;
		$output_array[$key]['full_time'] = $key;

		$partners = (!empty($lead['cf_795'])) ? $lead['cf_795'] : 'no_partner';
		
		$output_array[$key]['count'] = (int)(isset($output_array[$key]['count'])) ? $output_array[$key]['count']+1 : 1;

		//leadstatus
		/******/
		// Offen, in Beratung, Pausiert //- unbearbeitet - in Beratung - pausiert
		// Abgelehnt //- abgelehnt
		// in Einreichung, Bestätigung von Bank, Übergeben/Unterfertigt //- in Einreichung - Genehmigt von Bank - Übergeben (unterzeichnet) - 
		// in Abrechnung //- Abgerechnet mit Optifin
		// Abgerechnet //- Abgerechnet mit Affiliate
		/*******/
		$leadstatus = $lead['leadstatus'];
		if(($leadstatus == 'unbearbeitet') or ($leadstatus == 'in Beratung') or ($leadstatus == 'pausiert')){
			$output_array[$key]['status_count']['offen'] = (int)(isset($output_array[$key]['status_count']['offen'])) ? $output_array[$key]['status_count']['offen']+1 : 1;
			$output_array[$key]['users'][$partners]['status_count']['offen'] = (int)(isset($output_array[$key]['users'][$partners]['status_count']['offen'])) ? $output_array[$key]['users'][$partners]['status_count']['offen']+1 : 1;
		
		} elseif(($leadstatus == 'in Einreichung') or ($leadstatus == 'Genehmigt von Bank') or ($leadstatus == 'Übergeben (unterzeichnet)')){
			$output_array[$key]['status_count']['einreichung'] = (int)(isset($output_array[$key]['status_count']['einreichung'])) ? $output_array[$key]['status_count']['einreichung']+1 : 1;
			$output_array[$key]['users'][$partners]['status_count']['einreichung'] = (int)(isset($output_array[$key]['users'][$partners]['status_count']['einreichung'])) ? $output_array[$key]['users'][$partners]['status_count']['einreichung']+1 : 1;
		
		} elseif($leadstatus == 'abgelehnt'){
			$output_array[$key]['status_count']['abgelehnt'] = (int)(isset($output_array[$key]['status_count']['abgelehnt'])) ? $output_array[$key]['status_count']['abgelehnt']+1 : 1;
			$output_array[$key]['users'][$partners]['status_count']['abgelehnt'] = (int)(isset($output_array[$key]['users'][$partners]['status_count']['abgelehnt'])) ? $output_array[$key]['users'][$partners]['status_count']['abgelehnt']+1 : 1;
		
		} elseif($leadstatus == 'Abgerechnet mit Optifin'){
			$output_array[$key]['status_count']['abrechnung'] = (int)(isset($output_array[$key]['status_count']['abrechnung'])) ? $output_array[$key]['status_count']['abrechnung']+1 : 1;
			$output_array[$key]['users'][$partners]['status_count']['abrechnung'] = (int)(isset($output_array[$key]['users'][$partners]['status_count']['abrechnung'])) ? $output_array[$key]['users'][$partners]['status_count']['abrechnung']+1 : 1;
		
		} elseif($leadstatus == 'bgerechnet mit Affiliate'){
			$output_array[$key]['status_count']['abgerechnet'] = (int)(isset($output_array[$key]['status_count']['abgerechnet'])) ? $output_array[$key]['status_count']['abgerechnet']+1 : 1;
			$output_array[$key]['users'][$partners]['status_count']['abgerechnet'] = (int)(isset($output_array[$key]['users'][$partners]['status_count']['abgerechnet'])) ? $output_array[$key]['users'][$partners]['status_count']['abgerechnet']+1 : 1;
		}

		//users
		$output_array[$key]['users'][$partners]['count'] = (int)(isset($output_array[$key]['users'][$partners]['count'])) ? $output_array[$key]['users'][$partners]['count']+1 : 1;
		$output_array[$key]['users'][$partners]['users'][] = array(
			'id' => $lead['id'],
			'leadstatus' => $lead['leadstatus'],
			'partner' => $partners,
			'partner_url' => $lead['cf_845'],
			'created_time' => $createdtime
		);

	}
	
}

//OUTPUT
// var_export($output_array);
if($output_array){
	krsort($output_array);
	file_put_contents('data.json', json_encode($output_array));
}


// кількість юзерів за рік-місяць
// кожен статус кількість




// - lead id
// - lead status
// - partner
// - partner URL
// - created time


   // "Anrede":"cf_757",
   // "Titel":"cf_759",
   // "Vorname":"cf_793",
   // "Last Name":"lastname",
   // "Primary Email":"email",
   // "Primary Phone":"phone",
   // "Assigned To":"assigned_user_id",
   // "Secondary Phone":"cf_791",
   // "Geburtsdatum":"cf_761",
   // "Secondary Email":"secondaryemail",
   // "Beruf":"cf_763",
   // "Haushaltsnettoeinkommen":"cf_765",
   // "Email Opt Out":"emailoptout",
   // "Regionalleiter E-Mail":"cf_801",
   // "Lead Status":"leadstatus",
   // "Partner":"cf_795",
   // "Kaufpreis":"cf_771",
   // "Ablehnungsgr\u00fcnde":"cf_785",
   // "Eigenmittel":"cf_775",
   // "Voraussichtlicher Provisionsfluss":"cf_789",
   // "Finanzierungsbedarf":"cf_773",
   // "Bundesland - Immobilie":"cf_781",
   // "Vorhaben":"cf_777",
   // "Status Immobilie":"cf_769",
   // "Immobilienart":"cf_779",
   // "Wiedervorlage":"cf_797",
   // "Partner-URL":"cf_845",
   // "Street":"lane",
   // "Postal Code":"code",
   // "City":"city",
   // "Bundesland - Kunde":"cf_783",
   // "Country":"country",
   // "Description":"description",
   // "old-leadstatus":"cf_847",
   // "old-description":"cf_849",
   // "old-partnerID":"cf_851",
   // "unbearbeitet-date":"cf_809",
   // "in Beratung-date":"cf_811",
   // "pausiert-date":"cf_813",
   // "abgelehnt-date":"cf_815",
   // "in Einreichung-date":"cf_817",
   // "Genehmigt von Bank-date":"cf_819",
   // "\u00dcbergeben (unterzeichnet)-date":"cf_821",
   // "Abgerechnet mit Optifin-date":"cf_823",
   // "Abgerechnet mit Affiliate-date":"cf_825",
   // "Fb Lead":"cf_952"