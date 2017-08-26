
#tutorial de como conectar:
#http://razzpisampler.oreilly.com/ch07.html
#ojo los swich no van con 3v, sino gnd y el pin
#from RPLCD import CharLCD, cleared, cursor
import RPi.GPIO as GPIO
import time
 
#Setup GPIOs
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
GPIO.setup(21,GPIO.IN,pull_up_down=GPIO.PUD_UP)#Print Button
GPIO.setup(18,GPIO.IN,pull_up_down=GPIO.PUD_UP)# +time
GPIO.setup(16,GPIO.IN,pull_up_down=GPIO.PUD_UP)# -time
GPIO.setup(3,GPIO.IN)#Sensor soil
GPIO.setup(10,GPIO.OUT)#Coolers
GPIO.setup(11,GPIO.OUT)#Luz
GPIO.setup(12,GPIO.OUT)#Riego-Valvula
GPIO.setup(13,GPIO.OUT)#Riego-Bomba
GPIO.output(13,GPIO.LOW)

#Variables
lista=[]
hora_de_encendido=0
hora_de_apagado=0
hora_de_riego=0
temperatura_ambiente=25#asociar al sensor temperaturistico
temperatura_maxima=30#un input mas cheto, + y - con un select(elegir que input variar. con cada click rota el input al proximo item)

 
while True:
    
	#Riego
	hora_de_riego = hora_de_encendido -1
	if(hora_de_riego==-1):
		hora_de_riego=23
	#Realtime
	year, month, day, hour, minute = time.strftime("%Y,%m,%d,%H,%M").split(',')
	hora_actual = int(hour)
	inputVer=GPIO.input(21)	
	if(inputVer==0):
	#sto de abajo quiero que sea un switch para seleccionar y dos (up and down) mas y menos
		print("Current Time	"+str(hour)+":"+str(minute)+"	Hs")
		print("ON 		"+str(hora_de_encendido)+"	Hs")
		print("OFF 		"+str(hora_de_apagado)+"	Hs")
		print("Riego a las:	"+str(hora_de_riego)+"	Hs")	
		print(str(lista))

	inputSumarHorasEncendido = GPIO.input(18)
	if(inputSumarHorasEncendido == 0):
		lista=[]
		hora_de_encendido+=1
		print ("ON "+str(hora_de_encendido))
    
 
	inputSumarHorasApagado = GPIO.input(16)
	if(inputSumarHorasApagado == 0):
		lista=[]
		hora_de_apagado+=1
		print ("OFF "+str(hora_de_apagado))
	

 	if(hora_de_encendido== 24):
		hora_de_encendido = 0
    
	if(hora_de_apagado == 24):
		hora_de_apagado = 0
	
	lista=[] 
	#calculo de la lista, tiene cuales son las horas de funcionamento
	#[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2]
	if(hora_de_apagado > hora_de_encendido):
		dif= hora_de_apagado - hora_de_encendido
		for i in xrange(0,dif):
			lista.append(hora_de_encendido+i)
	if(hora_de_apagado < hora_de_encendido):
		dif= hora_de_apagado - hora_de_encendido
		horas_totales= 24 + dif
		for i in xrange(0,horas_totales):
			if( hora_de_encendido + i > 24):
				lista.append(hora_de_encendido+i - 24)
			else:
				lista.append(hora_de_encendido+i)
               
     

	if(hora_actual in lista):
		GPIO.output(11,GPIO.HIGH)

	else:
		GPIO.output(11,GPIO.LOW)

	time.sleep(0.5)


