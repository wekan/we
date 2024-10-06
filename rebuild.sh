#!/bin/bash


echo "Recommended for development: Newest Ubuntu or Debian, directly to SSD disk or dual boot, not VM. Works fast."
echo "Note: If you use other locale than en_US.UTF-8 , you need to additionally install en_US.UTF-8"
echo "      with 'sudo dpkg-reconfigure locales' , so that MongoDB works correctly."
echo "      You can still use any other locale as your main locale."

#Below script installs newest node 8.x for Debian/Ubuntu/Mint.

function pause(){
	read -p "$*"
}

echo
PS3='Please enter your choice: '
options=("Install dependencies" "Build" "Run Meteor for dev on http://localhost:4000" "Run Meteor for dev on http://CURRENT-IP-ADDRESS:4000" "Run Meteor for dev on http://CUSTOM-IP-ADDRESS:PORT" "Quit")

select opt in "${options[@]}"
do
    case $opt in
        "Install dependencies")

		if [[ "$OSTYPE" == "linux-gnu" ]]; then
			echo "Linux";
			# Debian, Ubuntu, Mint
			sudo apt-get install -y build-essential gcc g++ make git curl wget p7zip-full zip unzip unp npm
			sudo npm -g install n
			sudo n 20.18.0
			# Install Meteor, if it's not yet installed
			sudo npm install -g meteor --unsafe-perm
			#sudo chown -R $(id -u):$(id -g) $HOME/.npm $HOME/.meteor
		elif [[ "$OSTYPE" == "darwin"* ]]; then
		        echo "macOS";
			pause '1) Install XCode 2) Install Node 14.x from https://nodejs.org/en/ 3) Press [Enter] key to continue.'
		elif [[ "$OSTYPE" == "cygwin" ]]; then
		        # POSIX compatibility layer and Linux environment emulation for Windows
		        echo "TODO: Add Cygwin";
			exit;
		elif [[ "$OSTYPE" == "msys" ]]; then
		        # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
		        echo "TODO: Add msys on Windows";
			exit;
		elif [[ "$OSTYPE" == "win32" ]]; then
		        # I'm not sure this can happen.
		        echo "TODO: Add Windows";
			exit;
		elif [[ "$OSTYPE" == "freebsd"* ]]; then
		        echo "TODO: Add FreeBSD";
			exit;
		else
		        echo "Unknown"
			echo ${OSTYPE}
			exit;
		fi

		break
		;;

    "Build")
		echo "Building."
		rm -rf node_modules .meteor/local .build
                chmod u+w *.json
		meteor npm install
		meteor build .build --directory
		(cd .build/bundle/programs/server && rm -rf node_modules && chmod u+w *.json && meteor npm install)
		# Cleanup
		find . -type d -name '*-garbage*' | xargs rm -rf
		find . -name '*phantom*' | xargs rm -rf
		find . -name '.*.swp' | xargs rm -f
		find . -name '*.swp' | xargs rm -f
		echo Done.
		break
		;;

    "Run Meteor for dev on http://localhost:4000")
		NODE_OPTIONS="--max_old_space_size=4096 --trace-warnings" ROOT_URL=http://localhost:4000 meteor run --exclude-archs web.browser.legacy,web.cordova --port 4000
		break
		;;

    "Run Meteor for dev on http://CURRENT-IP-ADDRESS:4000")
		IPADDRESS=$(ip a | grep 'noprefixroute' | grep 'inet ' | cut -d: -f2 | awk '{ print $2}' | cut -d '/' -f 1)
		echo "Your IP address is $IPADDRESS"
		NODE_OPTIONS="--max_old_space_size=4096 --trace-warnings" ROOT_URL=http://$IPADDRESS:4000 meteor run --exclude-archs web.browser.legacy,web.cordova --port 4000
		break
		;;

    "Run Meteor for dev on http://CUSTOM-IP-ADDRESS:PORT")
		ip address
		echo "From above list, what is your IP address?"
		read IPADDRESS
		echo "On what port you would like to run?"
		read PORT
		echo "ROOT_URL=http://$IPADDRESS:$PORT"
		NODE_OPTIONS="--max_old_space_size=4096 --trace-warnings" ROOT_URL=http://$IPADDRESS:$PORT meteor run --exclude-archs web.browser.legacy,web.cordova --port $PORT
		break
		;;

    "Quit")
		break
		;;
    *) echo invalid option;;
    esac
done
