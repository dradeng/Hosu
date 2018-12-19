import React from "react";
import { Item, Button } from "semantic-ui-react";

const PropertyMapCard = (props) => {

    const { pro } = props



    return (
        <Item style={{maxWidth:120}}>
            <Item.Image
                src={pro.images[0]}
                size="tiny"
                className="img-responsive"
                style={{width: "100%"}}
            />
            <Item.Content>
                <Item.Header >
                    <strong>
                        {pro.title}
                    </strong>
                </Item.Header>
                <Item.Meta>
                    <span>
                        <i>{pro.address.length
                            ? pro.address
                            : null}
                        </i>
                    </span>
                    <br />
                    <br />
                    <span className="cinema">

                    </span>
                </Item.Meta>
            </Item.Content>
        </Item>
    );
}

export default PropertyMapCard;
