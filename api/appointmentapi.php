<?php
header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Headers: X-Requested-With, Authorrization, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers");

include "classfile.php";

$validate = new validate; // class for validating values
$valjwt = new jwtclass; // class for jwt validation
$class = new sqlops; // class for sql operations
$post = json_decode(file_get_contents('php://input'),TRUE);
$key = $post['key'];

$code = "";
$cookie = "";

if ( $key == "01" ) {
	foreach ($post as $key => $value) {
        if(empty($value)){
            $code = '01'; $message = $key.' cannot be empty';
        }else{
            if($key == 'email'){
                if($validate->validateemail($value) == false){
                    $code = '01'; $message = 'enter a valid email address';
                }
            }elseif($key == 'surname' || $key == 'name' || $key == 'othernames'){
                if($validate->validatealnum($value) == false ) {
                    $code = '01'; $message = $key.' cannot contain numbers or special characters';
                }
            }
        }
    }
    if ( $code != '01' ) {
    	$col = "*";
		$tab = "registration";
		$where = " WHERE email = '".$post['email']."' ";

		if ( $get = $class->select_fetch($col, $tab, $where, "") ) {
			$code = "00"; $message = $get;
		} else {
			$code = "11"; $message = "Invalid Email";
		}
    }
}

if ( $key == '02' ) {
	$col = 'email';
	$tab = 'registration';
	$where = " email = '".$post['email']."' ";

	$id = sha1($post['email'].time());
	$tab2 = 'appointment_table';
	$col2 = 'email, appointment_id';
	$vals2 = " '".$post['email']."', '$id' ";

	if ( $class->select($col, $tab, $where) ) {
		$set = " email = '".$post['email']."', surname = '".$post['surname']."', name = '".$post['name']."', othernames = '".$post['othernames']."', phone_no = '".$post['phone']."' ";

		$upd = $class->update($tab, $set, $where);
		$ins2 = $class->insert($tab2, $col2, $vals2);

		if ( $upd && $ins2 ) {
			$code = '00'; $message = $id;
		}
	} else {
		$col = 'email, surname, name, othernames, phone_no, status';
		$vals = " '".$post['email']."', '".$post['surname']."', '".$post['name']."', '".$post['othernames']."', '".$post['phone']."', '1' ";

		$ins = $class->insert($tab, $col, $vals);
		$ins2 = $class->insert($tab2, $col2, $vals2);

		if ( $ins && $ins2 ) {
			$code = '00'; $message = $id;
		}
	}
}

if ( $key == '03' ) {
	$col = '*';
	$tab = 'appointments';

	if ($get=$class->fetch_assoc($col, $tab, '', '')) {
		$code = '00'; $message = $get;
	} else {
		$code = '11'; $message = [];
	}
}

if ( $key == '04' ) {
	$newd = new DateTime($post['seldate']) ;
	$newd->setTimezone(new DateTimeZone('GMT+1'));
	$newdate = strtotime($newd->format('Y-m-d H:i:s'));

	if ( strtotime($post['seldate']) < (time() + 1800) ) {
		$code = '01'; $message = 'Please choose date and time at least 30 minutes from now';
	} else {
		$col = 'date';
		$tab = "appointment_table";
		$where = " WHERE date = '$newdate' && paid = '1' ";
		$get = $class->select_fetch($col, $tab, $where, '');
		if ($get) {
			$code = '01'; $message = 'Reservation already booked. Please choose another time';
		} else {
			$set = " appointment = '".$post['appointment']."', date = '$newdate', paid = '0' "; //0 means not paid
			$where = " appointment_id = '".$post['id']."' ";

			if ( $class->update($tab, $set, $where) ) {
				$col = '*';
				$tab = 'registration';
				$join = " LEFT JOIN appointment_table ";
				$on = " ON registration.email = appointment_table.email";
				$where = " WHERE appointment_table.appointment_id = '".$post['id']."' ";

				if ( $sel = $class->join($col, $tab, $join, $on, $where) ) {
					$code = '00'; $message = $sel[0]['survey_status'];
				}
			} else {
				$code = '11'; $message = 'Appointment not recorded';
			}
		}	
	}
}

if ( $key == '05' ) {
	$tab = 'appointment_table';
	$col = '*';
	$where = " WHERE appointment_id = '".$post['id']."' ";

	if ( $get = $class->select_fetch($col, $tab, $where, '') ) {
		$code = '00'; $message = $get->appointment_id;
	} else {
		$code = '11'; $message = $post['id'].' not found';
	}
}

if ( $key == '06' ) {
	$tab = 'appointment_table';
	$col = '*';
	$where = " WHERE appointment_id = '".$post['id']."' ";

	if ( $get = $class->select_fetch($col, $tab, $where, '') ) {
		$code = date("M d, Y H:i", $get->date); $message = $get;
	} else {
		$code = '11'; $message = $get;
	}
}

if ( $key == '07' ) {
	$col = '*';
	$tab = 'registration';
	$join = " LEFT JOIN appointment_table ";
	$on = " ON registration.email = appointment_table.email";
	$where = " WHERE appointment_table.appointment_id = '".$post['id']."' ";

	if ( $sel = $class->join($col, $tab, $join, $on, $where) ) {
		$set = 'status = 2';
		$where = " email = '".$sel[0]['email']."' ";

		$upd = $class->update($tab, $set, $where);
	}	

	$tab = 'appointment_table';
	$set = 'paid = 1';
	$where = " appointment_id = '".$post['id']."' ";

	$upd2 = $class->update($tab, $set, $where);

	if ( $upd && $upd2 ) {
		$code = '00'; $message = ucwords($sel[0]['name']).', Your reservation has been booked';
	} else {
		$code = '11'; $message = 'Error';
	}
}

if ( $key == '08' ) {
	$tab = 'survey';
	$col = 'email';
	$where = " email = '".$post['email']."' ";

	if ( $class->select($col, $tab, $where) ) {
		$code = '01'; $message = 'Feedback has already been recieved';
	} else {
		$cols = "email, fullname, phone, instagram, address, age_range, fav_color, fav_designer, fash_icon, fav_trend, fav_style, neverwear, wardrobe_woman, fitted_or_free, garment_length, notify_me";
		$cols = "email, fullname, phone, instagram, address, age_range, fav_color, fav_designer, fash_icon, fav_trend, fav_style, neverwear, wardrobe_woman, fitted_or_free, garment_length, notify_me";
		$vals = " '".$post['email']."', '".$post['fullname']."', '".$post['phone']."', '".$post['instagram']."', '".$post['address']."', '".$post['age_range']."', '".$post['fav_color']."', '".$post['fav_designer']."', '".$post['fav_icon']."', '".$post['fash_trend']."', '".$post['fav_style']."', '".$post['neverwear']."', '".$post['wardrobe_woman']."', '".$post['fitted_or_free']."', '".$post['garment_length']."', '".$post['notify_me']."' ";

		if ( $class->insert($tab, $cols, $vals) ) {
			$tab = 'registration';
			$set = " survey_status = '1' ";
			$where = " email = '".$post['email']."' ";

			$class->update($tab, $set, $where);

			$code = '00'; $message = 'Feedback Recieved';
		} else {
			$code = '11'; $message = 'Error. Please Retry';
		}
	}
}

if ( $key == '09' ) {
	$col = '*';
	$tab = 'registration';
	$join = " LEFT JOIN appointment_table ";
	$on = " ON registration.email = appointment_table.email";
	$where = " WHERE appointment_table.appointment_id = '".$post['id']."' ";

	if ( $sel = $class->join($col, $tab, $join, $on, $where) ) {
		$code = '00'; $message = $sel[0];
	}
}


// ********** ADMIN END **********

//admin login
if ( $key == '10' ) {
	foreach ($post as $key => $value) {
        if(empty($value)){
            $code = '01'; $message = $key.' cannot be empty';
        }
    }
    //if there are no errors above
    if($code != '01'){
        $tab = 'admin';
        $col =  'username, password';
        $where = " WHERE username = '".$post['username']."' ";
        $selfetch = $class->select_fetch($col, $tab, $where, '');

        if(!$selfetch){
            $code = '02'; $message = 'Invalid login';
        }elseif( $post['password'] === $selfetch->password ) {
            $issuer = "http://localhost:800";
            $audience = "http://localhost:800/admin-dashboard";
            $user = "'".$post['username']."'";
            $varJWT = $valjwt->encrypt_jwt($issuer, $audience, $user);
            
            $code = '00'; $message = 'Login Successful'; $cookie = $varJWT;
        }else{
            $code = '03'; $message = 'Invalid login';
        }
    } 
}

//fetch customers
if ( $key == '11' ) {
	$col = '*';
	$tab = 'registration';
	if ( $post['type'] == '1' ) {		
		if ( $get = $class->fetch_assoc($col, $tab, '', '') ) {
			$code = '00'; $message = $get;
		} else {
			$code = '11'; $message = $get;
		}
	} else {
		$where = " WHERE status = 2";

		if ( $get = $class->fetch_assoc($col, $tab, $where, '') ) {
			$code = '00'; $message = $get;
		} else {
			$code = '11'; $message = $get;
		}
	}
}

//fetch appointments
if ( $key == '12' ) {
	$beginOfDay = strtotime("midnight", time());
	$endOfDay   = strtotime("tomorrow", $beginOfDay);
	$endOfTmrw = strtotime('tomorrow', $endOfDay);
	$rangeOfWeek = $beginOfDay + 604800; //604800 = secs in a week

	$datearray = [];
	$timearray = [];

	$col = '*';
	$tab = 'appointment_table';
	$join = " LEFT JOIN registration ";
	$on = " ON registration.email = appointment_table.email";

	if ( $post['id'] == '0' ) { //fetch all appointments
		$where = " WHERE date > '".time()."' && paid = '1' ";

		if ( $get = $class->join($col, $tab, $join, $on, $where) ) {			
			foreach ( $get as $key => $value ) {
				array_push($datearray, date("M D d, Y", $get[$key]['date']));
				array_push($timearray, date("H:i", $get[$key]['date']));
			}
			$code = [$datearray, $timearray]; $message = $get;
		} else {
			$code = '11'; $message = $get;
		}

	} else if ( $post['id'] == '1' ) { //fetch appointments for today
		$where = " WHERE date > '".time()."' && paid = '1' && date < '$endOfDay' ";

		if ( $get = $class->join($col, $tab, $join, $on, $where) ) {
			foreach ( $get as $key => $value ) {
				array_push($datearray, date("M D d, Y", $get[$key]['date']));
				array_push($timearray, date("H:i", $get[$key]['date']));
			}
			$code = [$datearray, $timearray]; $message = $get;
		} else {
			$code = '11'; $message = $get;
		}

	} else if ( $post['id'] == '2' ) { //fetch appointments for today
		$where = " WHERE date > '".time()."' && paid = '1' && date >= '$endOfDay' && date < '$endOfTmrw' ";

		if ( $get = $class->join($col, $tab, $join, $on, $where) ) {
			foreach ( $get as $key => $value ) {
				array_push($datearray, date("M D d, Y", $get[$key]['date']));
				array_push($timearray, date("H:i", $get[$key]['date']));
			}
			$code = [$datearray, $timearray]; $message = $get;
		} else {
			$code = '11'; $message = $get;
		}

	} else if ( $post['id'] == '3' ) {
		$where = " WHERE date > '".time()."' && paid = '1' && date < '$rangeOfWeek' ";

		if ( $get = $class->join($col, $tab, $join, $on, $where) ) {
			foreach ( $get as $key => $value ) {
				array_push($datearray, date("M D d, Y", $get[$key]['date']));
				array_push($timearray, date("H:i", $get[$key]['date']));
			}
			$code = [$datearray, $timearray]; $message = $get;
		} else {
			$code = '11'; $message = $get;
		}
	}
	
}

//fetch surveys
if ( $key == '13' ) {
	$tab = 'survey';
	$col = '*';

	if ( $get = $class->fetch_assoc($col, $tab, '', '') ) {
		$code = '00'; $message = $get;
	} else {
		$code = '11'; $message = $get;
	}
}

//appointment history
if ( $key == '14' ) {
	$tab = 'appointment_table';
	$col = '*';
	$where = " WHERE email = '".$post['email']."' && paid = '1' ";

	if ( $get = $class->fetch_assoc($col, $tab, $where, '') ) {
		$datearray = [];
		$timearray = [];
		foreach ( $get as $key => $value ) {
			array_push($datearray, date("M D d, Y", $get[$key]['date']));
			array_push($timearray, date("H:i", $get[$key]['date']));
		}
		$code = [$datearray, $timearray]; $message = $get;
	} else {
		$code = '11'; $message = 'No appointment found';
	}
}

echo json_encode(['code'=>$code, 'message'=>$message, 'cookie'=>$cookie]);
?>