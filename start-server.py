import zerorpc
import pandas as pd
import logging
import numpy as np
logging.basicConfig()

def rand_weights(n):
    k = np.random.rand(n)
    return k / sum(k)

def calcMuSigma(returns):
    p = np.asmatrix(np.mean(returns, axis=1))
    w = np.asmatrix(rand_weights(len(returns)))
    C = np.asmatrix(np.cov(returns))

    mu = w * p.T
    sigma = np.sqrt(w * C * w.T)

    # This recursion reduces outliers to keep plots pretty
    if sigma > 2:
        return calcMuSigma(returns)
    return mu, sigma


class ServerRPC(object):
    def getReturns(self, prices):
        columns = []
        for x in prices['columns']:
            columns.append(x['name'])
        dataframes = {}
        prices = pd.DataFrame(prices['data'],columns=columns)
        # Calculate Returns
        for item in prices['ticker'].unique():
            dataframes[item] = prices.loc[prices['ticker']==item]
            dataframes[item]['returns'] = dataframes[item]['close'].pct_change(1)
            dataframes[item] = dataframes[item].dropna(subset=['returns'])
        return_vec = [
            list(dataframes[x]['returns']) for x in dataframes.keys()
        ]
        n_portfolios = 500
        means, stds = np.column_stack([
            calcMuSigma(return_vec)
            for _ in xrange(n_portfolios)
        ])
        prices = {}
        means = [
            i[0] for i in means
        ]
        stds = [
            i[0] for i in stds
        ]
        prices['means'] = means
        prices['stds'] = stds
        print(prices['stds'])
        return prices

s = zerorpc.Server(ServerRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()
