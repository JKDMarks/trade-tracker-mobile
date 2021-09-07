import React from "react";
import { Grid } from "semantic-ui-react";

function Card({ card, openOverlay, cardPrice }) {
    const { editions, setIdx, isFoil, quantity } = card;

    return (
        <div
            className={`trade-card vert-ctr-parent ${isFoil ? "foil-bkgr" : null}`}
            onClick={() => openOverlay(card, false) /* SECOND ARG IS isAdding */}
        >
            <Grid centered className="m-0" style={{ height: "100%", maxHeight: "100%" }}>
                <Grid.Row className="p-0" textAlign="center" style={{ maxWidth: "100%" }}>
                    <Grid.Column className="ellipsis" verticalAlign="middle">
                        {editions[setIdx].name}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="p-0" verticalAlign="middle">
                    <Grid.Column
                        width={10}
                        className="trade-card-text ellipsis"
                        style={{ fontSize: "1em", float: "left" }}
                    >
                        <span>${cardPrice(card)}</span>
                        <br />
                        <span style={{ color: "#0000aa" }}>
                            x{quantity} = <u>{(cardPrice(card) * quantity).toFixed(2)}</u>
                        </span>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <i className={`ss ss-2x ss-${editions[setIdx].set}`} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
}

export default Card;
