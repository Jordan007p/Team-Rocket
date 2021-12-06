# Arhitekturen Dizajn

Aplikacijata ke bide izgradena vo python i planirano e da ima i exe kako i direkten WebApp. Klientot e povrzan so ostanatoto od aplikacijata preku internetot. Aplikacijata ima dva dela sto pravat vistinska funkcija Biznis logikata i Database logikata kako i Kontrolerot koj raboti kako koordinator. Tipicniot korisnik gleda ili prazni polinja koj treba da gi popolni so svojata posakana destinacija ili krajniot rezultat na presmetkata. Kontrolerot koj gi koordinira dvata drugi delovi praka i prima site komunikacii pomegu klientot, klient serverot i biznis logikata. Tipicno Kontrolerot dobiva baranje. Toj praka baranje kon Database Serverot kako i Biznis Serverot. Biznis Serverot ja dobiva potrebnata database i pravi presmetka. Presmetkata se praka na kontrolerot koj krajno ja prepraka na Klientot. 


## Koncepciski pogled
![Untitled Diagram drawio](https://user-images.githubusercontent.com/85809428/144928345-25075abe-23b9-4331-83dc-ad5da665fca8.png)
## Izvrsen Pogled
![Untitled Diagram drawio (1)](https://user-images.githubusercontent.com/85809428/144930344-0ea6fce8-f82f-47b8-8085-c8db27b15666.png)
## Implementaciski pogled
![Untitled Diagram drawio (2)](https://user-images.githubusercontent.com/85809428/144931493-33f7268f-551e-4365-8a7a-0bd866067222.png)
