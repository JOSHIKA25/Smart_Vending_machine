#import numpy as np
"""import pandas as pd

# Dataset
data = [
    ['Sunny', 'Warm', 'Normal', 'Strong', 'Warm', 'Same', 'Yes'],
    ['Sunny', 'Warm', 'High',   'Strong', 'Warm', 'Same', 'Yes'],
    ['Rainy', 'Cold', 'High',   'Strong', 'Warm', 'Change', 'No'],
    ['Sunny', 'Warm', 'High',   'Strong', 'Cool', 'Change', 'Yes']
]

cols = ['Sky', 'AirTemp', 'Humidity', 'Wind', 'Water', 'Forecast', 'EnjoySport']
df = pd.DataFrame(data, columns=cols)

# EDA
print("Number of Samples:", len(df))
print("Positive Samples:", (df['EnjoySport'] == 'Yes').sum())
print("Negative Samples:", (df['EnjoySport'] == 'No').sum())

X = np.array(df.iloc[:, :-1])
y = np.array(df.iloc[:, -1])

# Initialize S
for i in range(len(y)):
    if y[i] == 'Yes':
        S = X[i].copy()
        break

# Initialize G
G = [['?' for _ in range(len(S))]]

print("\nInitial Specific Hypothesis S:", S)
print("Initial General Hypothesis G:", G)

# Candidate Elimination
for i in range(len(X)):
    if y[i] == 'Yes':
        for j in range(len(S)):
            if X[i][j] != S[j]:
                S[j] = '?'

    else:  # Negative example
        new_G = []
        for g in G:
            for j in range(len(S)):
                if g[j] == '?' and S[j] != X[i][j]:
                    temp = g.copy()
                    temp[j] = S[j]
                    new_G.append(temp)
        G = new_G

# Remove fully general hypothesis
G = [g for g in G if not all(attr == '?' for attr in g)]

# Final Output
print("\nFinal Specific Hypothesis (S):")
print(S)

print("\nFinal General Hypotheses (G):")
for g in G:
    print(g)
"""


import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

data=[
    ['Sunny', 'Warm', 'Normal', 'Strong', 'Warm', 'Same', 'Yes'],
    ['Sunny', 'Warm', 'High',   'Strong', 'Warm', 'Same', 'Yes'],
    ['Rainy', 'Cold', 'High',   'Strong', 'Warm', 'Change', 'Noca'],
    ['Sunny', 'Warm', 'High',   'Strong', 'Cool', 'Change', 'Yes']
]
col=['Sky', 'AirTemp', 'Humidity', 'Wind', 'Water', 'Forecast', 'EnjoySport']

df=pd.DataFrame(data,columns=col)

#eda
print("no of att",len(df))
print("pos col",(df['EnjoySport']=='Yes').sum())
print("nrg col",(df['EnjoySport']=='No').sum())
""""
x=np.array(df.iloc[:,:-1])
y=np.array(df.iloc[:,-1])

for i in range(len(y)):
    if y[i]=='Yes':
        s=x[i].copy()
        break

G=[['?' for _ in range(len(s))]]

print("\nInitial Specific Hypothesis S:", s)
print("Initial General Hypothesis G:", G)

for i in range(len(x)):
    if y[i]=='Yes':
        for j in range(len(s)):
            if x[i][j]!=s[j]:
                s[j]='?'
    else:
        new=[]
        for g in G:
            for j in range(len(s)):
                if g[j]=='?' and s[j]!=x[i][j]:
                    tem=g.copy()
                    tem[j]=s[j]
                    new.append(tem)        
        G=new
G=[g for g in G if not all(at=='?' for at in g)]

print(s)
print("\n")
for g in G:
    print(g)
    """
#histogram
plt.hist(df['AirTemp'],bins=10)
plt.title("hist variation")
plt.xlabel("AitTemp varia")
plt.ylabel("frequency")
plt.show()

#bar chart
df['Humidity'].value_counts().plot(kind='bar')
plt.show()

#line chart
plt.plot(df['EnjoySport'])
plt.title("enjoy trend")
plt.show()

#pie chart
df['Sky'].value_counts().plot(kind='pie',autopct='%1.1f%%')
plt.ylabel("")
plt.show()

#heatmap
df_encoded = df.apply(lambda x: pd.factorize(x)[0])
sns.heatmap(df_encoded.corr(),annot=True,cmap='coolwarm')
plt.title("hetmap variations")
plt.show()

#pair plot
df_encoded=df.apply(lambda x:pd.factorize(x)[0])
sns.pairplot(df_encoded)
plt.title("pair plotting")
plt.show()