import React, {PureComponent} from 'react';

export default class CityInfo extends PureComponent {

    render() {
        const {info} = this.props;
        const displayName = `${info.name}`;

        return (
            <div>
                <div>
                    {displayName}
                </div>
                <div style={{width: 200}}>
                <img width={200} src={info.images[0]} />
                </div>
                <div>
                    {info.text}
                </div>
            </div>
        );
    }
}