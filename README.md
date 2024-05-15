# Návrh a implementace helpdesku pro vybrané zdravotnické zařízení - Frontend
## Autor: Vladyslav Babyč

### Návod na spuštení aplikace

Pro spuštění aplikace je nutné mít nainstalovaný software [Docker](https://www.docker.com)

Po stažení repositáře je potřeba nejdříve vytvořit image aplikace a nahrát jí do Docker Hubu pomocí příkazu: 

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t <username/repository:tag-name> --push .
```

Poté může být aplikace spuštěna pomocí příkazu:

```bash
docker run --rm --name=<container-name> -p 80:80 -d <username/repository:tag-name>
```

Pozn.: Uvedené příkazy je potřeba zadávat do příkazového řádku v kořenovém adresáři projektu.

Pozn.: Proměnné v závorkách <> je potřeba nahradit skutečnými hodnotami.

Pozn.: Pro nahrání aplikace do Docker Hubu je potřeba mít účet na této platformě.
