"""import numpy as np
import pandas as pd
data=pd.DataFrame({
    'color':['red','red','blue','red'],
    'size':['small','large','small','small'],
    'shape':['round','round','square','square'],
    'class':['yes','yes','no','yes']
})
print(data.isnull().sum())
print(data.shape)
print(data.dtypes)
print("nega",(data['class']=='no').sum())
print("posi", (data['class']=='yes').sum())
x=data.iloc[:,:-1].values
y=data.iloc[:,-1].values
num=x.shape[1]
s=['%']*num
G=[['?']*num]

def spe(h,x):
    for i in range(num):
        if h[i]!='?' and h[i]!=x[i]:
            return False
    return True

def gen(g,s):
    for i in range(num):
        if g[i]!='?' and g[i]!=s[i]:
            return False
    return True

for i in range(len(x)):
    if y[i]=='yes':
        for j in range(num):
            if s[j]=='%':
                s[j]=x[i][j]
            elif s[j]!=x[i][j]:
                s[j]='?'
        G=[g for g in G if spe(g,x[i])]
    else:
        new=[]
        for g in G:
            if spe(g,x[i]):
                for j in range(num):
                    if g[j]=='?' and s[j]!='?' and s[j]!=x[i][j]:
                        h=g.copy()
                        h[j]=s[j]
                        new.append(h)
        G=new
    G=[g for g in G if spe(g,s)]
    
print("fianl S",s)
for g in G:
    print("final G",g)
"""
"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import BayesianRidge
from sklearn.preprocessing import PolynomialFeatures
from scipy.stats import norm

x=np.array([1,2,3,4,5,6,7,8,9,6])
y=np.array([34,21,67,36,90,82,71,94,81,58])

xnew=np.linspace(x.min(),x.max(),200)
for d in [1,2,3]:
    coe=np.polyfit(x,y,d)
    poly=np.poly1d(coe)
    ynew=poly(xnew)
    plt.plot(xnew,ynew,label=f"Degree {d}")

plt.scatter(x,y)
plt.xlabel("no of persons")
plt.ylabel("age")
plt.title("persons vs age")
plt.legend()
plt.show()

X=x.reshape(-1,1)
xn=PolynomialFeatures(degree=3)
xnp=xn.fit_transform(X)

model=BayesianRidge()
model.fit(xnp,y)

xne=np.linspace(x.min(),x.max(),200).reshape(-1,1)
xnep=xn.transform(xne)
yne=model.predict(xnep)

plt.scatter(x,y)
plt.plot(xne,yne,label="drawing")
plt.xlabel("no of persons")
plt.ylabel("age")
plt.title("persons vs age")
plt.legend()
plt.show()

high=y>=70
mu=np.mean(y)
sig=np.std(y)
pri=np.sum(high)/len(y)
lik=1-norm.cdf(70,mu,sig)
pos=pri*lik
print(pos)

def gau(x,mu,sig):
    return (1/sig*(np.sqrt(2*(np.pi)))*np.exp(-0.5*((x-mu)/sig)**2))

yn=np.linspace(y.min(),y.max(),200)
ga=gau(yn,mu,sig)
plt.hist(y,bins=6,alpha=0.6,label="histo")
plt.plot(yn,ga,label="gaus dis")
plt.xlabel("no of persons")
plt.ylabel("age")
plt.title("persons vs age")
plt.legend()
plt.show()

"""

"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Ridge
from sklearn.linear_model import Lasso
from sklearn.linear_model import ElasticNet
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
# Features
np.random.seed(0)

X1 = np.random.rand(100) * 10      # Feature 1
X2 = np.random.rand(100) * 5       # Feature 2

# Output variable (dependent)
y = 3*X1 + 2*X2 + np.random.randn(100)*2
# Combine features
X = np.column_stack((X1, X2))

# Split into training and testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
linear_model = LinearRegression()
linear_model.fit(X_train[:, 0].reshape(-1,1), y_train)

y_pred_linear = linear_model.predict(X_test[:, 0].reshape(-1,1))

print("Linear Regression")
print("MSE:", mean_squared_error(y_test, y_pred_linear))
print("R2 Score:", r2_score(y_test, y_pred_linear))
print()
multi_model = LinearRegression()
multi_model.fit(X_train, y_train)

y_pred_multi = multi_model.predict(X_test)

print("Multiple Linear Regression")
print("MSE:", mean_squared_error(y_test, y_pred_multi))
print("R2 Score:", r2_score(y_test, y_pred_multi))
print()
ridge_model = Ridge(alpha=1.0)
ridge_model.fit(X_train, y_train)

y_pred_ridge = ridge_model.predict(X_test)

print("Ridge Regression")
print("MSE:", mean_squared_error(y_test, y_pred_ridge))
print("R2 Score:", r2_score(y_test, y_pred_ridge))
print()
lasso_model = Lasso(alpha=0.1)
lasso_model.fit(X_train, y_train)

y_pred_lasso = lasso_model.predict(X_test)

print("Lasso Regression")
print("MSE:", mean_squared_error(y_test, y_pred_lasso))
print("R2 Score:", r2_score(y_test, y_pred_lasso))
print()
elastic_model = ElasticNet(alpha=0.1, l1_ratio=0.5)
elastic_model.fit(X_train, y_train)

y_pred_elastic = elastic_model.predict(X_test)

print("Elastic Net Regression")
print("MSE:", mean_squared_error(y_test, y_pred_elastic))
print("R2 Score:", r2_score(y_test, y_pred_elastic))
print(lasso_model.intercept_)
print(lasso_model.coef_)


print(np.random.seed(10))
"""
"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df=pd.DataFrame({
    'math':np.random.randint(10,50,20),
    'english':np.random.randint(40,50,20),
    'tamil':np.random.randint(20,90,20),
    "gen":np.random.choice(['f','m'],20)
})

plt.hist(df['tamil'],bins=5,label="tamil scores")
plt.xlabel("tamil")
plt.ylabel("values")
plt.title("tamil scores")
plt.legend()
plt.show()

gend=df['gen'].value_counts()
plt.bar(gend.values,gend.index)
plt.xlabel("gender")
plt.ylabel("values")
plt.title("gender scores")
plt.legend()
plt.show()

plt.plot(df['english'])
plt.xlabel("tamil")
plt.ylabel("values")
plt.title("tamil scores")
plt.legend()
plt.show()

cor=df[['math','english','tamil']].corr()
sns.heatmap(cor,annot=True)
plt.title("tamil scores")
plt.show()

sns.pairplot(df[['math','english','tamil']])
plt.xlabel("tamil")
plt.ylabel("values")
plt.title("tamil scores")
plt.legend()
plt.show() 

plt.pie(gend.values,labels=gend.index,autopct="%1.1f%%")
plt.title("tamil scores")
plt.legend()
plt.show()
"""
import numpy as np
df=np.random.randint(10,100,np.nan)
n=len(df)
m=n/2
print(df)
print(df.shape)
print(df.size)
print(df.ndim)
print(df[0])
print(df[-1])
print(df[len(df)//2])
print(df.dtype)
print(df[:5])
print(np.min(df))
print(np.max(df))
print(np.mean(df))
print(np.sum(df))
print(np.std(df))
res=df.reshape(2,5)
print(res)
print(res.flatten())
print(df+5)
print(df*2)
print(np.multiply(df,2))
print(np.square(df))
mar=df[df>50]
print(len(mar))
df1=np.random.randint(10,50,10)
print(np.hstack((df,df1)))
print(np.vstack((df,df1)))
print(np.array_split(df,3))
print(np.dot(df,df1))
print(df.T)
print(df>df1)
sq=np.eye(3)
print(np.linalg.det(sq))