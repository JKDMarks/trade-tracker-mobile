import React from "react";
import { Grid, Modal } from "semantic-ui-react";

function Settings({ isOpen, closeSettings }) {
    return (
        <Modal
            className="ctr-txt"
            open={isOpen}
            onClose={closeSettings}
            closeIcon
            closeOnDimmerClick={false}
            size="mini"
        >
            <Modal.Content className="vert-ctr-parent">
                <Grid centered className="vert-ctr">
                    <Grid.Row>
                        <Grid.Column textAlign="center">
                            Check out my{" "}
                            <a target="_blank" rel="noreferrer" href="https://github.com/jkdmarks">
                                GitHub
                            </a>{" "}
                            :^)
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
        </Modal>
    );
}

export default Settings;
