# copy media files to docs for publishing
rm -rf ./public/rosegarden
rm -rf ./public/JJazzLab
mkdir -p ./public/rosegarden
mkdir -p ./public/JJazzLab
mkdir -p ./public/ardour
cp ../rosegarden/* ./public/rosegarden/
cp ../JJazzLab/* ./public/JJazzLab/
# copy mp3 files from ardour exports (protect against space in names)
rm -rf ./public/ardour
find "../ardour" -name "*.mp3" |grep "/export/"|grep -v "Untitled-" | while read line; do folder=$(echo "$line"|cut -d / -f 3) ; mkdir -p "./public/ardour/$folder" ; cp "$line" "./public/ardour/$folder/"; done


# build json from directory tree
echo '' > files.txt
find ./public/ardour -name "*.mp3"| while read line; do ls  -gG -l --time-style='+%Y-%m-%d-%H-%M'   "$line" |cut -b 21-500; done > files.txt
find ./public/contributions -name "*.mp3"| while read line; do ls  -gG -l --time-style='+%Y-%m-%d-%H-%M'   "$line" |cut -b 21-500; done >> files.txt
ls  -gG -l --time-style='+%Y-%m-%d-%H-%M' ./public/rosegarden/*.mid|cut -b 20-500 >> files.txt
ls  -gG -l --time-style='+%Y-%m-%d-%H-%M' ./public/JJazzLab/*.mid |cut -b 20-500 >> files.txt
ls  -gG -l --time-style='+%Y-%m-%d-%H-%M' ./public/JJazzLab/*.sng|cut -b 20-500 >> files.txt
ls  -gG -l --time-style='+%Y-%m-%d-%H-%M' ./public/JJazzLab/*.mix|cut -b 20-500 >> files.txt
ls  -gG -l --time-style='+%Y-%m-%d-%H-%M' ./public/rosegarden/*.rg|cut -b 20-500 >> files.txt
	
cat files.txt|jq -Rn '[inputs]' > ./src/files.json
cat metafiles.txt|jq -Rn '[inputs]' > ./src/metafiles.json
#rm files.txt
	
