<template>
    <div class="grid grid-cols-12 gap-y-10 gap-x-6">
        <div class="col-span-12">
            <div class="flex flex-col lg:flex-row items-start h-auto mt-12">
                <div class="text-lg font-medium group-[.mode--light]:text-white">
                    {{ $t('market.forexGlossary') }}
                </div>
                <div class="group-[.mode--light]:text-white/80 mx-3 hidden lg:block">
                    <br>
                </div>
                <div class="group-[.mode--light]:text-white/80 text-slate-500 leading-relaxed mt-2 lg:mt-0 lg:ml-3">
                    {{ $t('market.glossaryDesc') }}
                </div>
            </div>
            <div class="flex mt-16 flex-col box box--stacked ">
                <div class="px-10 pt-6">
                    <!-- Header Section -->
                    <header class="flex flex-wrap items-center justify-between mb-5 gap-4">
                        <h1 class="text-2xl font-bold">Forex Glossary</h1>
                        <input v-model="searchQuery" type="search" placeholder="Search term..."
                            class="p-2 text-base border border-gray-300 rounded w-40" />
                    </header>

                    <!-- Glossary Content -->
                    <main>
                        <ul class="list-none p-0 m-0">
                            <li v-for="(definition, term) in filteredGlossary" :key="term">
                                <details>
                                    <summary>{{ term }}</summary>
                                    <p>{{ definition }}</p>
                                </details>
                            </li>
                        </ul>
                    </main>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

// Glossary Data
const glossary = {
    Abandon:
        "Abandon literally means rejection (from the French. Abandon). As applied to the sphere of financial operations, abandon can be a waiver of any right or property, withdrawal from a transaction, waiver of using an option until its full expiration date.",
    "Accelerator/Decelerator":
        "The Accelerator/Decelerator technical indicator shows the acceleration or deceleration of the current market driving force.",
    "Accumulation/Distribution":
        "Accumulation/Distribution is an indicator designed to reflect cumulative inflows and outflows of money by comparing closing prices with corresponding highs and lows.",
    "ADR (American Depository Receipts)":
        "The American Depositary Receipt is used to trade in securities of foreign companies in the United States. Shares of foreign companies are acquired by the American depositary bank in the process of listing these shares on US stock exchanges. This scheme has been used since 1927. Receipts (ADRs) are denominated in US dollars. In the same way, they are freely traded in Europe. ADRs are a tool for raising capital in the US and international markets. They may have different names that meet the requirements of a particular market.",
    AMEX:
        "World Stock Exchange, which grew out of a small company of stock traders in the second largest US stock exchange. Its distinctive feature is that shares of firms that are in the development stage (small and medium business) are traded here. Two major indices are calculated on this exchange: AMEX Major Market Index and AMEX Market Value Index.",
    Arbitrage:
        "Simultaneous purchase of an undervalued financial asset and sale of its overvalued equivalent in order to make further risk-free profit from the price difference of assets which emerged as a result of temporary market inefficiency.",
    "Ascending Triangle":
        "The Ascending triangle graphical price pattern is a chart pattern of an existing trend continuation, which is usually formed in an uptrend and confirms its further direction.",
    "Ask price":
        "The ask price is the price at which one buys any financial instrument.",
    "Ask Rate": "See ask price",
    Asset:
        "An instrument which has an economic value and may generate income in future.",
    AUDUSD:
        "The Australian dollar and the US dollar currency pair. In this pair the Australian dollar is the base currency, and the US dollar is the quoted one.",
    Aussie: "Slang term for the Australian dollar.",
    "Automated Trading":
        "Automated trading gives an opportunity to make the trading process absolutely automated.",
    "Average Directional Index (ADX)":
        "Average Directional Index (ADX) is a technical indicator developed by Welles Wilder to determine the strength of a trend and the further price movement by analyzing the dynamics and the differences between the lowest and highest trading prices.",
    "Average True Range Indicator":
        "The ATR indicator was developed to measure market volatility.",
    "Awesome Oscillator":
        "Awesome Oscillator (AO) is an indicator which reflects precise changes in the market driving force which helps to identify the strength of a trend including the points of its formation and reversal.",
    Backwardation:
        "Backwardation is a situation in which the current futures price is lower than the price of the underlying asset. Backwardation is also sometimes called a situation where the futures price with a later expiration date is lower than the futures price with an earlier date.",
    "Balance/account balance":
        "The total financial result of all the completed transactions and operations of the deposit/withdrawal of funds from a trading account.",
    "Bank of Canada (BOC)": "The Bank of Canada is the central bank of Canada.",
    "Bank of England (BOE)":
        "The Bank of England is the central bank of the United Kingdom.",
    "Bank of Japan (BOJ)":
        "The Bank of Japan is the central bank of Japan.",
    "Bar chart":
        "This type of chart contains four values of an asset price for each time interval: high, low, opening, and closing prices. High and low prices are reflected by a vertical line, while the opening and closing prices - by horizontal lines. The line on the left of the bar is the opening price, while the line on the right of the bar is the closing price.",
    "Base currency":
        "The first currency in a currency pair in the Forex market.",
    "Base Interest Rate":
        "There are interest rates that banks set to determine the key interest rate for different types of lending. Their size depends on the supply and demand for credit resources, market interest rates and other factors. Initially, the base interest rate is set by the central bank of the country; at this rate, all other banks can borrow from the central bank. The base interest rate set by the central bank has a direct impact on the value of said country’s currency. Therefore, tracking changes in this indicator can help the trader in making trades in forex.",
    Basis:
        "Basis is the difference in price between the futures price and the price of the underlying asset. The basis can be both positive and negative. By the time the contract expires, the basis will be zero, as futures and spot prices will be equal.",
    "Basis point":
        "A Basis point is a unit of measurement which is equal to one hundredth of a percent. When interest rates are calculated it is necessary to remove all ambiguity: in this case the unit becomes the base point. For example, an increase of the base rate from 7% to 7.2% would imply a 20 base point change.",
    "Bear Market":
        "A market, which is characterized by falling prices (quotes).",
    "Bearish Rectangle":
        "The rectangle graphical pattern serves to confirm the direction of the existing trend. The bearish rectangle is formed in a downtrend and indicates high probability for the further decrease in the asset price.",
    Beneficiary:
        "In the financial sphere, the term “beneficiary” is often used. It means the recipient of the benefit: in monetary or other terms. The beneficiary is a legal entity or an individual making a profit / profit in accordance with debt and other financial documents.",
    "Bid Price": "The bid price is the price at which one sells any financial instrument.",
    "Bid/Ask Spread": "The difference between the Bid and Ask prices.",
    "Big Board":
        "Big Board is trader slang for the New York stock exchange. The exchange is the largest in the world in terms of the total cost of companies’ shares which form part of the listing. At this exchange the largest amount of stocks in the world are traded and over 3,000 corporations are quoted.",
    "Binary options":
        "Binary options are a relatively new financial instrument which differs in that they have a fixed cost and that risks and potential profit are known in advance. Binary options are considered a good instrument for novice traders since the possible profit is known before entering into a trade and a position can be opened by simply choosing which direction the price is believed to be heading.",
    "Bollinger Bands Indicator":
        "The Bollinger Bands indicator reflects the current market volatility changes, confirms direction, warns about the opportunities of trend continuation or trend end, consolidation periods, increasing volatility for breakouts, as well as indicates the local highs and lows.",
    Break:
        "Break is used to signify the sharp rise and fall of prices. This is an indicator of monetary imbalances, when sellers are significantly stronger than buyers of a particular financial instrument.",
    "Bretton Woods Agreement":
        "In 1944 in Bretton Woods in the USA, members of the United Nations signed an agreement to establish a currency exchange rate system for economically developed nations. The US dollar became the reserve currency since, following the end of World War Two, the USA could guarantee the exchange of their currency for a fixed amount of gold. To support a system of international payments, the IMF (International Monetary Fund) was created. However, the Bretton Woods agreement did not take into account the fact that countries would seek to accumulate as big a dollar reserve as possible. This meant that the US could be put in a situation where it couldn’t cover the reserves using its gold. When Western Germany and France began to exchange their dollar reserves for gold in 1971 the US abandoned the obligations that they had assumed since 1944.",
    Broker:
        "A company or an individual which acts as an intermediary in giving access to markets and organizing trading financial instruments for its clients.",
    Bull:
        "A trader or an investor who acts with the belief that the market and prices on a certain financial instrument (currency pair, stock, etc.) will rise. Bull opens buy trades (long position).",
    "Bull Market":
        "A market which is characterized by an increase in prices (quotes).",
    "Bullish Rectangle":
        "The rectangle graphical pattern serves to confirm the direction of an existing trend. The bullish rectangle is formed in an uptrend and indicates high probability of continuation of the asset price growth.",
    "Candlestick chart":
        "This type of chart shows the opening and closing prices and also the highest and the lowest prices during a period. In case the opening price is higher than the closing price the body of the candle is shaded. In contrast, when the closing price is higher than the opening price, the body is not shaded.",
    CFD:
        "The abbreviation CFD stands for “Contract for Difference”. It is a contract between two parties: the seller pays the buyer the difference between the current value of an underlying asset and its value at the moment the contract is made if the difference is positive, and, vice versa, if the difference is negative, the buyer pays the seller. With CFDs traders can get access to underlying assets without actually owning them.",
    Channel:
        "The Channel is a sustainable corridor of fluctuations in the asset price with a constant width.",
    Chart:
        "Charts are graphical reflections of price changes of a financial instrument over time.",
    Clearing:
        "The procedure of settling orders between transacting parties.",
    "Commodity Channel Index (CCI)":
        "The Commodity Channel Index is an indicator developed by Donald Lambert. Despite the original purpose of the indicator to identify new trends, nowadays it is widely used to measure the current price level in relation to its average value.",
    "Commodity currencies":
        "Currencies of the countries, whose exports are mainly based on natural resources. The group may include currencies of both developing and developed countries, such as the Canadian dollar, the Australian dollar, the New Zealand dollar, the Russian ruble and others.",
    "Cross pair":
        "An exchange rate between two currencies derived from their corresponding rates with a third currency. As a rule, the term refers to a currency pair which does not contain the US dollar.",
    "Currency Cross Pairs":
        "Those currency pairs that do not include the US dollar in foreign exchange market trade are referred to as cross currency pairs or crosses.",
    "Currency Pair":
        "A financial instrument representing an operation of buying/selling of one currency for another.",
    "Daily chart":
        "A chart of the market movement, where one day is the time unit.",
    "Day trading":
        "Trading operations which are performed within one day.",
    Dealer:
        "A company or an individual which acts as a leading executor or a counterparty to the transaction.",
    "DeMarker (DeM) Indicator":
        "This indicator was developed as a tool to identify emerging buying and selling opportunities. It demonstrates the phases of the growing probability of price changes which usually correspond to the highs and lows of a price.",
    Depreciation: "Decrease in value of an asset.",
    Derivative:
        "A financial contract, the value of which depends on the value of one or more underlying assets. Such underlying assets may include indices, stocks, commodities, currencies and other assets.",
    "Descending Triangle":
        "The Descending triangle graphical price pattern is a chart pattern of an existing trend continuation, which is usually formed in a downtrend and confirms its further direction.",
    Diamond:
        "The graphical price pattern 'Diamond' is a sign of a subsequent reversal of an existing trend. Traditionally, the pattern is formed in an uptrend.",
    "Double Bottom":
        "The double bottom graphical price pattern is a sign of a reversal of an existing downtrend. It is considered that the longer the formation of the pattern, the more reliably it indicates a reversal.",
    "Economic calendar":
        "An economic calendar is a calendar of events provided by brokers and other financial companies through which traders track the events affecting the price movements of assets.",
    "Envelopes Indicator":
        "The Envelopes indicator reflects the overbought or the oversold state of the price, thus allowing to determine the entry and exit points from the market, as well as the moments of the possible trend break-down.",
    EURJPY:
        "The currency pair, formed from Euro and the Japanese yen, shows how many Japanese yen are needed to purchase one Euro.",
    Euro:
        "A monetary unit used in 19 countries of the European Union: Austria, Belgium, Germany, Greece, Ireland, Spain, Italy, Cyprus, Latvia, Lithuania, Luxembourg, Malta, the Netherlands, Portugal, Slovakia, Slovenia and Estonia.",
    EURUSD:
        "The most popular currency pair where Euro, is the base currency traded against the US dollar- the quoted currency.",
    Expiration:
        "The last day, when the deal on a derivative contract (futures, option, etc.) may be either executed or cancelled.",
    Flag:
        "The Flag refers to short-term graphical price patterns of trend continuation which show that its direction will remain unchanged in the near future. For example, on the daily chart, this pattern is often formed within a week or two.",
    "Force Index":
        "The Force Index is an indicator developed by Alexander Elder to measure the power of price movements interpreting the changes of its components: direction, magnitude and volume. This oscillator fluctuates around the zero level, which is the point of relative balance of forces that move the price.",
    "Foreign Exchange (Forex)":
        "The market where participants have the opportunity to buy, sell, exchange and speculate on currencies. The Forex market is comprised of commercial banks, central banks, investment management companies, hedge- funds, retail forex brokers and investors (traders).",
    "Forex Dealer":
        "A Forex dealer is a financial company authorized to organize foreign currency trading.",
    "Forex Resistance":
        "Price level which acts as a ceiling and caps the rise of the current currency price.",
    "Forward transaction":
        "Forward transaction is an urgent transaction in which the seller and the buyer agree to deliver the sold asset (currency, commodity) on a certain date in the future, while the price of the asset is decided at the moment of making the deal.",
    "Fractals Indicator":
        "Fractal is an indicator, which displays the local highs and lows where the price movement has stopped and reversed. These reversal points are respectively called Peaks and Troughs.",
    "Fundamental analysis":
        "The analysis of economic and political events, which may affect the future direction of prices in financial markets. In the currency market, fundamental analysis is based primarily on macroeconomic events.",
    Gap:
        "A break between prices, when the asset is having a big move up or down without trades occurring.",
    "Gator Oscillator":
        "The Gator Oscillator (GO) is a supplement to the Alligator indicator and is used alongside with it, showing the degree of convergence/divergence of its three SMAs and pointing at the Alligator's hunger or sleep periods (i.e. trending or non-trending periods of price movement).",
    GBPUSD:
        "GBP stands for British Pound which in this currency pair is traded against US dollar. The currency pair shows how many US dollars are needed to purchase one British Pound.",
    "Growth stock":
        "Growth stock is what they call a company’s shares which have good profit indicators (higher than average) over a certain period of time (generally a few years) or shares which have a good potential for growth in the near future. The main demarking aspect of this stock’s growth is that its value often rises much faster than that of other stock. However, a rapid decline in the value of such stock is also possible. Furthermore, stockholders for such companies either receive no share dividend whatsoever, or receive only a small dividend since profit is invested in the company’s development, especially when the company is relatively new.",
    "Head and Shoulders":
        "The head and shoulders graphical price pattern indicates the end of an existing trend and the further change in the direction of the price movement. It is typically formed in a developed uptrend.",
    "Hedge/hedging":
        "A strategy to decrease the risk of impact of volatile price fluctuations on trader’s positions. As a rule, hedging involves the sale or purchase at the forward price or the opening of a position on a similar asset. Hedging becomes more popular with the increase of market uncertainty.",
    "Ichimoku Indicator":
        "The Ichimoku indicator is a comprehensive technical analysis tool introduced in 1968 by Tokyo columnist Goichi Hosoda. The concept of the system was the opportunity to quickly understand the direction of the trend, its dynamics and strength by interpreting all the five components of the system combined with the price dynamics in terms of cyclical character of their interaction caused by the group dynamics of human behavior.",
    Inflation:
        "A process of a persistent rising of general level of prices of goods and services.",
    "Inverse Head and Shoulders":
        "The inverse head and shoulders graphical price pattern is a sign of a trend reversal. This pattern is usually formed in a developed downtrend.",
    Leverage:
        "A credit provided by the broker to his client for making large volume deals with a relatively small amount of capital.",
    "Libid/Libor":
        "LIBID stands for London Interbank Bid Rate. LIBOR stands for London Interbank Offered Rate.",
    "Limit order":
        "An order to buy or sell the given amount of an asset at a specified price or at a better one. For example, if the current price of USD/JPY is 108.24/108.26 (Bid/Ask), the trader can set a buy limit order, for example, at 107.50, if the price falls and the Ask price reaches 107.50, the deal will be made and the corresponding Buy position will be opened.",
    "Liquid market":
        "A market where traders can buy and sell large volumes of assets anytime and with low transaction costs.",
    "Listed Stocks":
        "This list contains stocks which are approved for trading on the stock exchanges. Before you get to the stock in the list, the shares go through the admission procedure - listing. Only companies that have been checked for compliance with certain requirements, such as capitalization, volumes of products sold, the number of securities in circulation, and others, are admitted to trading.",
    Lot:
        "Standard quantity of financial assets in one transaction.",
    Margin:
        "A certain amount of money required from a client to maintain opened positions.",
    "Margin call":
        "Company’s request for additional deposit of funds into a trading account.",
    "Market Facilitation Index":
        "The Market Facilitation Index is created to evaluate the market willingness to move the price. The absolute values of the indicator have no practical use therefore the dynamics of their changes is considered relative to the dynamics of the volume change.",
    "Market order":
        "The order of the purchase or sale of a financial instrument (e.g. currency) at the current market price.",
    "Momentum Indicator":
        "The Momentum is a technical analysis indicator which reflects the direction of a trend and measures the speed of the price change based on the comparison of the current and previous values.",
    "Money Flow Index (MFI)":
        "Money Flow Index (MFI) is a technical indicator developed to evaluate money inflow intensity into an asset by comparing price increases and decreases over a certain period, considering trading volumes.",
    "Moving Average Envelopes":
        "The indicator is used to determine the overbought and the oversold situations.",
    "Moving Average Indicator":
        "Moving Average is a technical analysis tool which shows the average price of an asset price over a certain period of time, smoothens price fluctuations and thus, reflects the direction and strength of a trend.",
    "Moving Average of Oscillator (OsMA)":
        "Moving Average of Oscillator (OsMA) is a technical analysis tool which reflects the difference between the oscillator (like MACD) and its moving average (the signal line).",
    "Moving-Average Convergence/Divergence Indicator (MACD)":
        "MACD indicator shows the convergence/divergence of moving averages and is designed to assess the strength and direction of a trend, as well as to identify the possible reversal points by receiving signals from the combination of three time series of moving averages (fast, slow and signal).",
    "OCO order":
        "OCO order is a combination of two pending orders set to open a position at prices different from the current market price. Execution of one of the two orders brings to an automatic removal of the remaining one.",
    Offer:
        "The suggested price at which a currency can be bought (“Ask” price).",
    "On-Balance Volume (OBV)":
        "On-Balance Volume is a cumulative indicator, based on the index of trade volumes, and reflecting the relation between the volume of deals and asset price movements.",
    "Open position":
        "Any transaction that has not been closed by a corresponding opposite transaction.",
    Order:
        "Any instruction by a client on performing trading operations.",
    "Out-of-the-money Option":
        "An Out-of-the-money Option is when, during trading, the option is worth less than was paid for it. For example, you predict that the price of an asset will rise, but it falls. Your forecast doesn’t come true and you lose money on the option. The option can fluctuate in and out of the money: i.e. be profit making (in-the-money) at one point and loss making (out-of-the-money) at another before the option expires.",
    Pair:
        "A financial instrument, which shows the value of one currency unit in terms of another.",
    "Parabolic Indicator":
        "Parabolic indicator was developed to confirm or reject trend direction, to determine the emergence of the correction phase or sideways movement, as well as to determine possible closing points for positions. The underlying principle of the indicator can be described by the phrase 'stop and reverse' (SAR).",
    Pennant:
        "Pennant refers to short-term graphical price patterns of trend continuation indicating that its direction will be unchanged in the near future. For example, on the daily chart the pattern is usually formed within a week or two.",
    "Point or pip":
        "The smallest possible change of quotation. As a rule, pip is equal to 0.0001 or 0.00001 for the majority of currency pairs, which are quoted to the fourth or fifth decimal point after the comma, but for JPY pairs it is 0.01 or 0.001 and is quoted to the second or third decimal point. For other financial instruments, the pip is usually equal from 0.1 to 0.001.",
    "Portfolio Trading":
        "The simultaneous purchase or sale of a basket of securities, combined in a portfolio based on some criteria.",
    Profit:
        "A positive financial result from trading operations.",
    "Quoted currency":
        "The second currency in a currency pair is called a quoted currency.",
    Rate:
        "The value of one currency in terms of another.",
    "Relative Strength Index (RSI)":
        "Relative Strength Index was developed to assess the strength or, on the contrary, the weakness of a trend, measure the speed of the price change by comparing its increases and decreases on the basis of closing prices.",
    "Relative Vigor Index":
        "Relative Vigor Index was developed to determine the direction of the prevailing trend. The behavior of the indicator is based on a simple idea that closing prices are significantly higher than opening prices in the bullish market and lower in the bearish market.",
    "Resistance Level":
        "Resistance is one of the key concepts of technical analysis. Resistance is defined as a price level at which the activity of asset sellers is quite significant to prevent the further purchase and increase in asset price.",
    "Retail customer":
        "Any party to a forex trade who is not an eligible contract participant as defined under the Commodity Exchange Act. This includes individuals with assets of less than $10 million and most small businesses.",
    "Risk management":
        "The identification and assessment of the risk level, as well as taking actions to eliminate the risk to a new desired level and monitoring that new risk level.",
    Rollover:
        "The process of extending the settlement date on an open position by rolling it over to the next settlement date.",
    Saucer:
        "The saucer is a long-term figure of technical analysis, signifying a slow change in the tendency of price to fall on a growth trend. Usually the saucer has an arcuate bottom, which is clearly seen on the weekly charts. The period of formation of this figure can last more than a year.",
    "Security deposit":
        "The amount of money needed to open or maintain a position. Also known as 'margin.'",
    Settlement:
        "The business process whereby securities are delivered to the buyer in exchange for payment to the seller, which usually takes place one to three days after the deal.",
    "Spot market":
        "A market, where trades are conducted with instant execution. Also note, that in the spot market the proprietary rights are transferred from the seller to the buyer at the moment of making a deal, and the final settlements may take up to two working days.",
    "Spot price":
        "The current price in the spot market.",
    Spread:
        "The difference between the Bid and Ask prices. In the quotes flow, received by the client in the trading terminal, both prices are presented. The current spread for a currency pair or an asset is an important part of liquidity of that financial instrument.",
    Sterling:
        "Slang term for the British pound (GBP).",
    "Stochastic Oscillator":
        "The Stochastic indicator determines the position of the current closing price in the price range of the last few periods, based on the idea that the price tends to the upper bound of fluctuations in an uptrend and to the lower bound- in a downtrend.",
    Stock:
        "Investments can be attracted in different ways. One of them is the issue of shares, which allows investors to become shareholders of the company and have the right, thereby, to receive dividends from the company's profit. Shares are not only a tool for receiving dividends, but on the stock market, investors can earn money due to periodic fluctuations in the price of these shares.",
    "Strike price":
        "The exchange rate at which the buyer of a call has the right to purchase a specific currency pair or at which the buyer of a put has the right to sell a specific currency pair. Also known as the 'exercise price.'",
    "Support Level":
        "Support is one of the key concepts of technical analysis. Support is defined as a price level at which the activity of asset buyers is quite significant to prevent the further sale and decrease in its price.",
    Swap:
        "The operation of crediting or debiting a certain amount of money from a client’s account when rolling the position over to the next value date ('to the next day'). The size of swap is proportional to the volume of the position and depends on the current difference of interest rates of base and quoted currencies (or assets) in the interbank lending market.",
    "Symmetric Triangle":
        "The Symmetric triangle graphical price pattern is a chart pattern of an existing trend continuation, which may be formed both in an uptrend and in a downtrend, and serves to confirm its further directions.",
    "Take Profit order":
        "Take Profit is designed to close a position once the targeted profit level has been reached by setting it at a price better than the price of position opening or the price of pending order execution.",
    "Technical analysis":
        "Technical analysis is used to forecast future changes in financial and commodity markets based on the history of price changes, i.e. past price movements.",
    "Technical Indicators":
        "Technical indicators are the inseparable part of technical analysis. Their aim is to predict the direction of the market to help a trader. Examples include Bill Williams' indicators, Oscillators, Trend, and Volume indicators.",
    Tick:
        "The smallest movement possible in the price of a financial instrument.",
    "Trailing Stop":
        "Trailing Stop mode maintains the mechanism of automatic shift of a linked Stop Loss order according to the following rule: if the profit of a position becomes higher than the set fixed distance, the Stop Loss order moves to the level on which the difference between the current market price and order price is equal to this distance.",
    "Transaction costs":
        "The costs, incurred by a trader when buying or selling currencies or commodities, which include the commission fee of a broker.",
    "Transaction date":
        "The date of the deal.",
    "Trend Continuation Patterns":
        "Trend continuation patterns (graphical models, patterns) are formed during the pause in the current market trends, and mark the movement continuation rather than its reversal.",
    "Trend line":
        "The lines connecting a series of extreme upper or extreme lower points on a price chart.",
    "Trend Reversal Patterns":
        "The Trend Reversal patterns are graphical models (patterns), which are formed after the price level reaches its high in the current trend and indicate high probability of trend reversal.",
    "Triple Bottom":
        "The Triple bottom graphical price pattern is usually formed in a downtrend and serves as a sign of its further reversal. This pattern is considered to be more significant than the 'double bottom.'",
    "Triple Top":
        "The Triple top graphical price pattern is usually formed in an uptrend anticipating its further reversal and decrease in prices. This pattern is considered to be more significant than the 'double top.'",
    USDCAD:
        "The currency pair, formed from the US dollar and the Canadian dollar, indicates how many Canadian dollars are needed to purchase one US dollar.",
    USDCHF:
        "The US dollar and the Swiss franc currency pair, where the US dollar is the base currency and the Swiss franc is the quoted currency.",
    USDJPY:
        "The US dollar and the Japanese yen currency pair. In this currency pair the US dollar is the base currency while the Japanese yen is the quoted one.",
    "Value date":
        "Date on which counterparties must deliver funds, that is when the currency bought is received and the currency sold is paid.",
    Volatility:
        "A measure of risk, usually a statistical indicator, which evaluates the degree of the price fluctuation of an asset.",
    "Volume Indicator":
        "Volume is a technical analysis indicator, which reflects investors’ trading activity for a certain period of time.",
    "Volume Indicators":
        "The Volume of deals characterizes the activity of market participants involved in asset trading, its strength and intensity.",
    Wedge:
        "The wedge refers to short-term graphical price patterns of trend continuation indicating that its direction will remain unchanged in the near future. For example, on the daily chart the pattern is often formed within a week or two.",
    "Williams Alligator":
        "Williams Alligator is an indicator created to identify the trends and their directions.",
    "Williams Percent Range Indicator":
        "The objective of the indicator is to determine the overbought or oversold conditions of the asset and the possible reversal points.",
    Yen:
        "The monetary unit of Japan.",
};

// State for search query
const searchQuery = ref("");

// Computed property for filtered glossary
const filteredGlossary = computed(() => {
    if (!searchQuery.value.trim()) {
        return glossary;
    }
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return Object.fromEntries(
        Object.entries(glossary).filter(([term]) =>
            term.toLowerCase().includes(lowerCaseQuery)
        )
    );
});
</script>

<style scoped>
.glossary-list li {
    margin-bottom: 20px;
    border-bottom: 1px dashed #ddd;
    padding-bottom: 15px;
}

details summary {
    font-weight: bold;
    cursor: pointer;
}

details p {
    margin: 10px 0 0;
    line-height: 1.5;
}
</style>
