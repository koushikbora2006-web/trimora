@echo off
set "PATH=C:\Users\ABHISHEK\AppData\Local\Programs\MinGit\cmd;%PATH%"
git config user.name abhishekmohan22
git config user.email abhishekmohan22@users.noreply.github.com
git add .
git commit -m "feat: John Salon and Beauty Spa platform with RAG chatbot and booking"
git branch -M main
git remote set-url origin https://github.com/abhishekmohan22/trimora.git
git remote -v
git push -u origin main
