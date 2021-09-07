import React, { Fragment } from "react";
import { Modal, Grid, Dropdown, Checkbox, Button, Icon } from "semantic-ui-react";

function Overlay({
    card,
    cardPrice,
    isOpen,
    isAdding,
    closeOverlay,
    editCardSet,
    editCardQuantity,
    toggleFoil,
    addToTrade,
    deleteFromTrade,
    setCardImg,
}) {
    const getCardImageUrl = (cardData) =>
        cardData?.image_uris?.border_crop || cardData?.card_faces?.[0]?.image_uris?.border_crop;

    if (card && Object.entries(card).length > 0) {
        const { editions, setIdx, isFoil, quantity } = card;

        const cardData = editions[setIdx];
        const {
            scryfall_uri,
            purchase_uris: { tcgplayer },
            related_uris: { edhrec },
        } = cardData;

        const cardImageUrl = getCardImageUrl(cardData);

        console.log("editions", editions);

        return (
            <Modal className="ctr-txt" open={isOpen} onClose={closeOverlay} closeIcon closeOnDimmerClick={false}>
                <Modal.Content className="vert-ctr-parent">
                    {editions && editions.length > 0 ? (
                        <Grid centered className="vert-ctr">
                            <Grid.Row className="pb-0">
                                <Grid.Column textAlign="center">
                                    <Icon
                                        name="picture"
                                        circular
                                        inverted
                                        link
                                        color="teal"
                                        onClick={() => setCardImg(cardImageUrl)}
                                    />
                                    <u>
                                        {card.editions[setIdx].name}{" "}
                                        {editions[0].reserved ? <span style={{ color: "grey" }}>(RL)</span> : null}
                                    </u>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row className="pt-0">
                                <Grid.Column textAlign="center">Price Per Card: ${cardPrice(card)}</Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column>
                                    <Dropdown className="selection" fluid text={editions[setIdx].set_name}>
                                        <Dropdown.Menu>
                                            {editions.map((edition, i) => (
                                                <Dropdown.Item
                                                    key={i}
                                                    value={i}
                                                    onClick={(e, { value }) => editCardSet(card, value)}
                                                    selected={editions.setIdx === i}
                                                    content={
                                                        <Grid columns={16} style={{ width: "100%" }}>
                                                            <Grid.Column width={4}>
                                                                <img
                                                                    src={getCardImageUrl(edition)}
                                                                    alt="card version preview"
                                                                    style={{
                                                                        // position: "relative",
                                                                        // top: "-5px",
                                                                        maxHeight: "60px",
                                                                    }}
                                                                />
                                                            </Grid.Column>
                                                            <Grid.Column width={3}>
                                                                <div className="vert-ctr-parent">
                                                                    <div className="vert-ctr">
                                                                        <i className={`ss ss-2x ss-${edition.set}`} />
                                                                    </div>
                                                                </div>
                                                            </Grid.Column>
                                                            <Grid.Column width={9}>
                                                                <div className="vert-ctr-parent">
                                                                    <div className="vert-ctr">{edition.set_name}</div>
                                                                </div>
                                                            </Grid.Column>
                                                        </Grid>
                                                    }
                                                />
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    <label style={{ maxWidth: "100%" }}>
                                        <input
                                            type="number"
                                            value={quantity}
                                            className="m-0"
                                            style={{ maxWidth: "25%" }}
                                            onChange={(e) => editCardQuantity(card, e.target.value)}
                                        />
                                        &nbsp; Quantity
                                    </label>
                                </Grid.Column>

                                <Grid.Column textAlign="center">
                                    <div className="vert-ctr-parent">
                                        <div className="vert-ctr">
                                            <Checkbox
                                                label="Foil"
                                                checked={isFoil}
                                                onChange={() => toggleFoil(card)}
                                                disabled={
                                                    isFoil
                                                        ? !editions[setIdx].prices.usd
                                                        : !editions[setIdx].prices.usd_foil
                                                }
                                            />
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>

                            {
                                /* 'ADD LEFT' AND 'ADD RIGHT' BUTTONS IF isAdding true, ELSE 'DELETE' BUTTON (IF EDITING) */
                                isAdding ? (
                                    <Grid.Row columns={2}>
                                        <Grid.Column textAlign="center">
                                            <Button
                                                className="px-3"
                                                color="green"
                                                content="Add Left"
                                                onClick={() => addToTrade(true) /* ARG OF addToTrade IS isLeft */}
                                            />
                                        </Grid.Column>
                                        <Grid.Column textAlign="center">
                                            <Button
                                                className="px-3"
                                                color="green"
                                                content="Add Right"
                                                onClick={() => addToTrade(false) /* ARG OF addToTrade IS isLeft */}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                ) : (
                                    <Grid.Row>
                                        <Grid.Column textAlign="center">
                                            <Button
                                                color="red"
                                                content="Delete From Trade"
                                                onClick={() => {
                                                    const confirmDelete = window.confirm("Delete this card?");
                                                    if (confirmDelete) {
                                                        deleteFromTrade(card);
                                                    }
                                                }}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            }

                            <Grid.Row className="pb-0">
                                <u>External Links</u>
                            </Grid.Row>
                            <Grid.Row className="pt-0" columns={3}>
                                <Grid.Column textAlign="center">
                                    <a target="_blank" rel="noreferrer" href={scryfall_uri}>
                                        Scryfall
                                    </a>
                                </Grid.Column>
                                <Grid.Column textAlign="center">
                                    <a target="_blank" rel="noreferrer" href={tcgplayer}>
                                        TCGplayer
                                    </a>
                                </Grid.Column>
                                <Grid.Column textAlign="center">
                                    <a target="_blank" rel="noreferrer" href={edhrec}>
                                        EDHREC
                                    </a>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    ) : null}
                </Modal.Content>
            </Modal>
        );
    } else {
        return <Fragment></Fragment>;
    }
}

export default Overlay;
