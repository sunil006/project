import pandas as pd
import requests
from xml.etree import ElementTree
import numpy as np
import geopy
import folium
import geopy.geocoders
from folium import IFrame
from  geopy.geocoders import Nominatim
import ssl
import sys
import geopy.geocoders
geopy.geocoders.options.default_timeout = 100000
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
geopy.geocoders.options.default_ssl_context = ctx
CropPriceUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001b604d81719c841f874031b45a07a7a53&format=xml&offset=0&limit=100"
geolocator = Nominatim(user_agent="my-application")
xmlfile = open('cropprice.xml', 'w')
xmldata = requests.get(CropPriceUrl)
xmlfile.write(xmldata.text)
xmlfile.close()
xml_data = 'cropprice.xml'
#print(xmldata.text)
tree = ElementTree.parse(xml_data)
state=[]
district=[]
market=[]
commodity=[]
max_price=[]
min_price=[]
modal_price=[]
locations=[]
record = tree.find('records')
for c in record.findall('item'):
    state.append(c.find('state').text)
    district.append(c.find('district').text)
    market.append(c.find('market').text)
    commodity.append(c.find('commodity').text)
    max_price.append(c.find('max_price').text)
    min_price.append(c.find('min_price').text)
    modal_price.append(c.find('modal_price').text)
    
df = pd.DataFrame(
    {'state' : state,
     'district' : district,
     'commodity' : commodity,
     'modal_price' : modal_price
    })

df = df.groupby('district').agg({'state':'first', 
                             'commodity': ', '.join, 
                             'modal_price':', '.join }).reset_index()
#print(df)
for district,state in zip(df['district'],df['state']):
    loc=geolocator.geocode(district+','+state)
    locations.append([loc.latitude,loc.longitude])
    print("hii")
#print(locations)
map = folium.Map(location=[15.8, 77.8], zoom_start=5)
for point in range(0, len(locations)):
    icon=folium.features.CustomIcon("https://image.flaticon.com/icons/svg/755/755140.svg",
                                      icon_size=(25, 25))
    #folium.features.GeoJsonTooltip("click to get crop prices ")
    cro= df["commodity"][point].split(",");
    pri= df["modal_price"][point].split(",");
    html=f"""
            <h2>prices of crops</h2>
            <p id="demo"></p>
            <script>
            var text=""
            console.log(typeof "{cro}")
            var crop=Array.from({cro})
            var price=Array.from({pri})
            for(var i=0;i<crop.length;
            text+=crop[i]+"-"+price[i]+"<br>",
            i++)
            document.getElementById("demo").innerHTML = text;
            console.log(text)
                            </script>
        """
    iframe = IFrame(html=html, width=500, height=300)
    popup = folium.Popup(iframe, max_width=2650)
    folium.Marker(locations[point],icon=icon ,tooltip="click to get crop prices",popup=popup).add_to(map)
map.save('index.html') 
