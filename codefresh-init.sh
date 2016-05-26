#!/bin/bash
#
echo -e "The script creates codefresh user and allows access from codefresh.io\n\
Please ensure:
  1. Currently only Ubuntu 14+ is supported
  2. The script is running by admin user ( root or sudo permitted user )
  3. Port tcp:2376 and tcp:22 should be open foe codefresh whitelist addresses
  4. All application ports are opened

" 

if ! ( . /etc/os-release && [[ $ID == ubuntu &&  ${VERSION_ID:0:2} -ge 14 ]] ); then
  echo "ERROR: Currently only Ubuntu 14+ is supported"
  exit 1
fi 

ACCOUNT_ID=
while [[ -z $ACCOUNT_ID ]]
do
  read -p "Enter account_id: " ACCOUNT_ID
  if [[ -z $ACCOUNT_ID ]]; then
     echo -e "ACCOUNT_ID is mandatory\n"
  fi
done

IP=$(curl ipecho.net/plain 2>/dev/null)
read -p "Enter public IP of the node - default ${IP}: " IP


read -p "Enter DNS name of the node (optional): " DNSNAME
if [[ -z "$DNSNAME" ]]; then
  DNSNAME=${IP}
fi


if [[ $(id -u) != 0 ]]; then
  SUDO=sudo
  echo "set sudo"
fi

$SUDO id codefresh 2>/dev/null && $SUDO userdel codefresh
 
$SUDO useradd -m -e "" -p "*" -G sudo -s $(which bash) codefresh
$SUDO su -c "echo \"codefresh ALL=NOPASSWD: ALL\" > /etc/sudoers.d/codefresh"

$SUDO su codefresh -c "mkdir -p /home/codefresh/.ssh && chmod 0700 /home/codefresh/.ssh"

ID_RSA_PUB="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDnzZpHjJ9w+IYxiF7rUyZxe6XxjegnP5RUnnmi4j9VepOB7jhBRl0lvrGMHi0y+L4Il2vzsCetQOtourfScet3r9/kvGV30Hp9+OLyt+HXwtDGP+tZ1oMW7vgd2gQ7EyNyUsQ7pBay+Xf1jTUzAn6moGIBfuVUdfeJVnhIYTCV1RP6bqVV+DvYN0vanrqQBFmwitAg848A71YrmPIDK8Hrhr/iShi8JfhgIqeSciBTpTpmg7civaLjpVJdRpgGJBqflYDLVCTTuEnROScsUwNfTpc5mobVcUUkA1rqA3ui4PPfXEDbNlWu04ZyfknGIQQJXhY0697xMVe/lcTzzrYt codefresh@docker-node"

$SUDO su codefresh -c "echo $ID_RSA_PUB > /home/codefresh/.ssh/authorized_keys && chmod 0600 /home/codefresh/.ssh/authorized_keys"

echo -e "\nSending request to bootstrap. Please wait, this might take several minutes ... \n"

curl -X POST http://addnode.cf-cd.com:3000/api/v1/node/"${ACCOUNT_ID}"?ip="${IP}"\&dnsname="${DNSNAME}"
#curl -X POST http://localhost:3000/api/v1/node/"${ACCOUNT_ID}"?ip="${IP}"\&dnsname="${DNSNAME}"
