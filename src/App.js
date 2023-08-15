import React, { useState, useEffect } from "react";
import "./App.css";

import { v1 as uuid } from "uuid";

import { Grid, Button, Search, Icon } from "semantic-ui-react";
import { useCookies } from "react-cookie";

import { useTrades } from "./useCustom";
import { Card, Overlay, Settings } from "./components";

// import { exampleTrade } from './helpers'
//
// const leftExample = exampleTrade.map(editions => {
//   return { id: uuid(), editions, setIdx: 0, isFoil: false, isLeft: true, quantity: 1 }
// })
//
// const rightExample = exampleTrade.map(editions => {
//   return { id: uuid(), editions, setIdx: 0, isFoil: false, isLeft: false, quantity: 1 }
// })

function App() {
    ////////// useState DECLARATIONS //////////
    const [cookies, setCookie, removeCookie] = useCookies(["trades"]);

    const [isLoading, setIsLoading] = useState(false);

    const [allCardNames, setAllCardNames] = useState([]); // LIST OF ALL CARD NAMES
    const [query, setQuery] = useState(""); // INPUT IN SEARCH BAR
    const [searchResult, setSearchResult] = useState([]); // LIST OF ALL CARD NAMES THAT MATCH query

    const [trades, setTrades, updateCard, deleteCard] = useTrades(); // ALL CARDS IN THE TRADE (BOTH COLS.)
    const [leftTrades, setLeftTrades] = useTrades([]); // CARDS IN LEFT COL ONLY, TECHNICALLY FAILS SSoT, BUT NEVER UPDATED DIRECTLY
    const [rightTrades, setRightTrades] = useTrades([]); // CARDS IN RIGHT COL. ONLY

    const [tradePrices, setTradePrices] = useState({ left: 0, right: 0 });

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isOverlayAdding, setIsOverlayAdding] = useState(true); // true IF ADDING A CARD, false IF EDITING A CARD
    const [overlayCard, setOverlayCard] = useState({});

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [cardImg, setCardImg] = useState(null);

    ////////// useEffect BLOCKS //////////
    // FETCH CARD NAMES WHEN APP MOUNTS
    useEffect(() => {
        async function fetchAllCardNames() {
            setIsLoading(true);
            const resp = await fetch("https://api.scryfall.com/catalog/card-names");
            const json = await resp.json();

            setAllCardNames(json.data);
            setIsLoading(false);
        }

        fetchAllCardNames();
        // setTrades([ ...leftExample, ...rightExample, ])

        if (cookies.trades && cookies.trades.length > 0) {
            const cardNames = cookies.trades.map(({ name }) => name);
            const formattedCardNames = `(${cardNames.map((name) => `!"${name}"`).join(" OR ")})`; // E.G. (!"Blood Crypt" OR !"Breeding Pool" OR !"Embercleave")

            async function fetchCards() {
                setIsLoading(true);
                const resp = await fetch(
                    `https://api.scryfall.com/cards/search?q=${formattedCardNames}%20-is:digital%20(is:funny%20OR%20-is:funny)&unique=prints`
                );
                const json = await resp.json();

                let { data } = json;
                // data = data.map(({ id, name, set, set_name, image_uris, prices }) => ({ id, name, set, set_name, image_uris, prices }))

                const cards = cookies.trades.map(({ name, id, isFoil, isLeft, quantity, setIdx }) => {
                    const editions = data.filter((card) => card.name === name);

                    return {
                        id,
                        isFoil,
                        isLeft,
                        quantity,
                        setIdx,
                        editions,
                    };
                });

                setTrades(cards);
                setIsLoading(false);
            }

            fetchCards();
        }
    }, []);

    useEffect(() => {
        // UPDATE LEFT & RIGHT TRADES, TECHNICALLY FAILS SSoT
        setLeftTrades(trades.filter((card) => card.isLeft));
        setRightTrades(trades.filter((card) => !card.isLeft));

        // UPDATES CARD IN OVERLAY
        if (isOverlayOpen) {
            const changedCard = trades.find((card) => card.id === overlayCard.id);
            setOverlayCard(changedCard);
        }

        // UPDATES cookies.trades
        const cookieTrades = trades.map(({ id, editions, isFoil, isLeft, quantity, setIdx }) => ({
            id,
            isFoil,
            isLeft,
            quantity,
            setIdx,
            name: editions[0].name,
        }));
        setCookie("trades", cookieTrades);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trades]);

    // UPDATE PRICES WHENEVER trades CHANGES
    useEffect(() => {
        const tradeSum = (trade) => {
            if (trade.length > 0) {
                return trade.reduce((sum, card) => {
                    return (Number(sum) + Number(cardPrice(card)) * card.quantity).toFixed(2);
                }, 0);
            } else {
                return 0;
            }
        };

        setTradePrices({
            left: Number(tradeSum(leftTrades)).toFixed(2),
            right: Number(tradeSum(rightTrades)).toFixed(2),
        });
    }, [leftTrades, rightTrades]);

    ////////// GENERAL FUNCTIONS //////////
    const cardPrice = (card) =>
        card.isFoil ? card.editions[card.setIdx].prices.usd_foil : card.editions[card.setIdx].prices.usd;

    const findCard = (card) => trades.find((findCard) => findCard.id === card.id);

    // const formattedCardPrice = (card) => cardPrice(card).replace(/\d(?=(\d{3})+\.)/g, '$&,')

    const tradeDiffStr = () => {
        const diff = tradePrices.left - tradePrices.right;

        if (diff > 0) {
            return `⏪ $${Number(diff).toFixed(2)}`;
        } else if (diff < 0) {
            return `$${Number(-diff).toFixed(2)} ⏩`;
        } else {
            return "Even trade";
        }
    };

    ////////// SEARCHBAR FUNCTIONS //////////
    const handleInputChange = (e, { value }) => {
        setQuery(value);

        // setSearchResult TO ONLY THE FIRST 25 CARDS THAT MATCH THE QUERY
        const re = new RegExp(value, "i");
        setSearchResult(
            allCardNames
                .filter((card) => re.test(card))
                .slice(0, 25)
                .map((name, i) => ({ key: i, name, title: name }))
        );
    };

    const handleResultSelect = (e, { result: { name } }) => {
        setIsLoading(true);
        setQuery(name);

        async function fetchCard() {
            const resp = await fetch(
                `https://api.scryfall.com/cards/search?q=!"${name}"%20-is:digital%20(is:funny%20OR%20-is:funny)&unique=prints`
            );
            const json = await resp.json();

            let { data } = json;
            // data = data.map(({ id, name, set, set_name, image_uris, prices }) => ({ id, name, set, set_name, image_uris, prices }))
            const card = {
                id: uuid(),
                editions: data,
                setIdx: 0,
                isFoil: !data[0].nonfoil,
                quantity: 1,
            };

            openOverlay(card, true);
            setQuery("");
            setIsLoading(false);
        }

        fetchCard();
    };

    ////////// OVERLAY FUNCTIONS //////////
    const openOverlay = (card, isAdding) => {
        setIsOverlayOpen(true);
        setOverlayCard(card);
        setIsOverlayAdding(isAdding);
        setQuery("");
        document.querySelector(".card-search input").blur();
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
        setOverlayCard({});
    };

    // DETERMINES DEFAULT FOIL VALUE OF CARD
    // IF EDITION HAS BOTH FOIL AND NONFOIL VERSIONS, RETURNS INPUT isFoil VALUE
    // ELSE IF EDITION DOESN'T HAVE ONE OF THE TWO, RETURNS WHAT IT CAN BE
    const foilVal = (card) => {
        const { editions, setIdx, isFoil } = card;
        const prices = editions[setIdx].prices;
        if (prices.usd && prices.usd_foil) {
            return isFoil;
        } else if (!prices.usd) {
            return true;
        } else if (!prices.usd_foil) {
            return false;
        }
    };

    const editCardSet = (card, setIdx) => {
        if (isOverlayAdding) {
            const overlayCardCopy = { ...overlayCard, setIdx };
            overlayCardCopy.isFoil = foilVal(overlayCardCopy);
            setOverlayCard(overlayCardCopy);
        } else {
            const cardCopy = { ...findCard(card), setIdx };
            cardCopy.isFoil = foilVal(cardCopy);
            updateCard(cardCopy);
        }
    };

    const editCardQuantity = (card, quantity) => {
        quantity = Number(quantity);
        if (quantity >= 0) {
            if (isOverlayAdding) {
                const overlayCardCopy = { ...overlayCard, quantity };
                setOverlayCard(overlayCardCopy);
            } else {
                const cardCopy = { ...findCard(card), quantity };
                updateCard(cardCopy);
            }
        }
    };

    const toggleFoil = (card) => {
        if (isOverlayAdding) {
            const overlayCardCopy = {
                ...overlayCard,
                isFoil: !overlayCard.isFoil,
            };
            setOverlayCard(overlayCardCopy);
        } else {
            const cardCopy = { ...findCard(card), isFoil: !card.isFoil };
            updateCard(cardCopy);
        }
    };

    const addToTrade = (isLeft) => {
        const overlayCardCopy = { ...overlayCard, isLeft };
        setTrades([overlayCardCopy, ...trades]);
        closeOverlay();
    };

    const deleteFromTrade = (card) => {
        deleteCard(card);
        closeOverlay();
        // setIsOverlayOpen(false);
        // setOverlayCard({});
    };

    const switchSideInTrade = (card) => {
        const cardCopy = { ...card, isLeft: !card.isLeft };
        updateCard(cardCopy);
        closeOverlay();
    };

    const barHeight = () =>
        document.querySelector("#control-height")
            ? `calc(100vh - ${document.querySelector("#control-height").clientHeight - window.innerHeight}px - 182px)`
            : "calc(100vh - 182px)";

    ////////// SETINGS FUNCTIONS //////////
    const openSettings = () => {
        setIsSettingsOpen(true);
    };

    const closeSettings = () => {
        setIsSettingsOpen(false);
    };

    ////////// JSX //////////
    return (
        <div className="App">
            <div id="control-height"></div>
            <Grid centered>
                {/* ///// HEADER ///// */}
                <Grid.Row centered className="header">
                    <Grid.Column width={2} className="vert-ctr-parent">
                        <Button
                            content="X"
                            color="red"
                            className="p-0 m-0 vert-ctr"
                            style={{ width: "15px", height: "15px" }}
                            onClick={() => {
                                const confirmClear = window.confirm("Clear this trade?");

                                if (confirmClear) {
                                    setTrades([]);
                                }
                            }}
                        />
                    </Grid.Column>
                    <Grid.Column width={12} textAlign="center">
                        <h1>Trade Tracker</h1>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Icon
                            name="cog"
                            size="large"
                            // color="black"
                            style={{
                                position: "absolute",
                                top: "25%",
                                right: "10%",
                            }}
                            onClick={openSettings}
                        />
                        {/*
                        // 'INFO ABOUT APP AND ME'
                        <Button
                            content='ℹ'
                            color='blue'
                            className='p-0 m-0 vert-ctr'
                            style={{width: '15px', height: '15px'}}
                            onClick={() => console.log('hi')}
                            />
                        */}
                    </Grid.Column>
                </Grid.Row>

                {/* ///// CARD SEARCH BAR ///// */}
                <Grid.Row style={{ backgroundColor: "#555555" }}>
                    <Search
                        className="card-search"
                        onSearchChange={handleInputChange}
                        onResultSelect={handleResultSelect}
                        results={searchResult}
                        value={query}
                    />
                </Grid.Row>

                {/* ///// TRADE DIFFERENCE ///// */}
                <Grid.Row
                    centered
                    className="p-0 price-col"
                    columns={1}
                    style={{
                        height: "35px",
                        width: "100vw",
                        backgroundColor: "lightgreen",
                    }}
                >
                    <div className="vert-ctr-parent">
                        <div className="vert-ctr">{tradeDiffStr()}</div>
                    </div>
                </Grid.Row>

                {/* ///// TRADE SUMS ///// */}
                <Grid.Row
                    centered
                    className="p-0"
                    columns={2}
                    style={{
                        height: "35px",
                        width: "100vw",
                        fontSize: "0.75em",
                    }}
                >
                    <Grid.Column className="ctr-txt price-col" style={{ backgroundColor: "lightblue", height: "100%" }}>
                        <div className="vert-ctr-parent">
                            <div className="vert-ctr">
                                ${tradePrices.left} (
                                {trades.reduce((acc, cur) => (cur.isLeft ? acc + cur.quantity : acc), 0)})
                            </div>
                        </div>
                    </Grid.Column>
                    <Grid.Column className="ctr-txt price-col" style={{ backgroundColor: "pink", height: "100%" }}>
                        <div className="vert-ctr-parent">
                            <div className="vert-ctr">
                                ${tradePrices.right} (
                                {trades.reduce((acc, cur) => (!cur.isLeft ? acc + cur.quantity : acc), 0)})
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>

                {/* ///// CARD COLUMNS ///// */}
                <Grid.Row style={{ position: "relative" }} className="py-0" columns={2}>
                    <Grid.Column
                        className="trade-col px-0"
                        style={{
                            borderLeft: "3px solid rgba(0,0,0,.1)",
                            minHeight: barHeight(),
                            maxHeight: barHeight(),
                        }}
                    >
                        {leftTrades.map((card) => (
                            <Card
                                key={card.id}
                                card={card}
                                isLeft={true}
                                openOverlay={openOverlay}
                                cardPrice={cardPrice}
                            />
                        ))}
                    </Grid.Column>
                    <Grid.Column
                        className="trade-col px-0"
                        style={{
                            minHeight: barHeight(),
                            maxHeight: barHeight(),
                        }}
                    >
                        {rightTrades.map((card) => (
                            <Card
                                key={card.id}
                                card={card}
                                isLeft={false}
                                openOverlay={openOverlay}
                                cardPrice={cardPrice}
                            />
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            {/* ///// EDIT/ADD CARD POPUP ///// */}
            <Overlay
                card={overlayCard}
                isAdding={isOverlayAdding}
                cardPrice={cardPrice}
                isOpen={isOverlayOpen}
                closeOverlay={closeOverlay}
                editCardSet={editCardSet}
                editCardQuantity={editCardQuantity}
                toggleFoil={toggleFoil}
                addToTrade={addToTrade}
                deleteFromTrade={deleteFromTrade}
                switchSideInTrade={switchSideInTrade}
                setCardImg={setCardImg}
            />

            <Settings isOpen={isSettingsOpen} closeSettings={closeSettings} />

            {cardImg ? (
                <div
                    style={{
                        zIndex: "1001",
                        maxWidth: "90vw",
                        minWidth: "90vw",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <img style={{ maxWidth: "100%" }} src={cardImg} alt="card-img" />
                    <Icon
                        name="close"
                        color="red"
                        size="big"
                        style={{
                            position: "absolute",
                            top: "10%",
                            right: "5%",
                        }}
                        onClick={() => setCardImg(null)}
                    />
                </div>
            ) : null}

            {isLoading ? (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <img
                        src="/images/WUBRG.png"
                        className="spin"
                        height="150px"
                        width="150px"
                        alt="spinning mana pentagon"
                    />
                </div>
            ) : null}
        </div>
    );
}

export default App;
