--- 
customlog: 
  - 
    format: combined
    target: /etc/apache2/logs/domlogs/vilasdesarrollo.com
  - 
    format: "\"%{%s}t %I .\\n%{%s}t %O .\""
    target: /etc/apache2/logs/domlogs/vilasdesarrollo.com-bytes_log
documentroot: /home/vilas/public_html
group: vilas
hascgi: 1
homedir: /home/vilas
ip: 51.254.111.187
owner: yeensvax
phpopenbasedirprotect: 1
port: 80
scriptalias: 
  - 
    path: /home/vilas/public_html/cgi-bin
    url: /cgi-bin/
serveradmin: webmaster@vilasdesarrollo.com
serveralias: mail.vilasdesarrollo.com www.vilasdesarrollo.com
servername: vilasdesarrollo.com
usecanonicalname: 'Off'
user: vilas
