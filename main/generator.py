while(True):
    tekst = input("Podaj tekst:\n")
    if(tekst != ""):
        tekst = "[ " + tekst + " ]"
    print("//",tekst.center(100,"-"),"//")