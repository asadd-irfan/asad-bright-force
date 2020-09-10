import React, { useState, useEffect } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import "../../App.scss";
// import { Input } from 'antd';


export default function SearchBar({ getLocation, talentLocation, disabledInput }) {
    const [address, setAddress] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [focusFlag, setFocusFlag] = useState(false);
    useEffect(() => {
        setAddress(talentLocation)
    }, [talentLocation]);

    const handleChange = address => {
        setFocusFlag(true)
        setAddress(address)
        setLatitude(null)
        setLongitude(null)
        setErrorMessage('')

    };

    const handleSelect = selected => {
        // console.log('selected', selected);
        setIsGeocoding(true);
        setAddress(selected)
        setFocusFlag(false)
        getLocation(selected)
        geocodeByAddress(selected)
            .then(res => getLatLng(res[0]))
            .then(({ lat, lng }) => {
                setLatitude(lat);
                setLongitude(lng);
                setIsGeocoding(false)

            })
            .catch(error => {
                setIsGeocoding(false)
                console.log('error', error); // eslint-disable-line no-console
            });
    };

    const handleCloseClick = () => {
        setAddress('')
        setLatitude(null)
        setLongitude(null)

    };
    console.log('disabledInput', disabledInput)

    const handleError = (status, clearSuggestions) => {
        console.log('Error from Google Maps API', status); // eslint-disable-line no-console
        setErrorMessage(status);
        clearSuggestions();

    };
    // console.log('address', address)

    return (
        <div>
            <PlacesAutocomplete
                onChange={handleChange}
                value={address && address}
                onSelect={handleSelect}
                className="input-style"
                onError={handleError}
                shouldFetchSuggestions={address?.length > 2}
                disabled={disabledInput}
            >

                {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                    {/* console.log('suggestions', suggestions)
                    console.log('getInputProps', getInputProps)
                    console.log('getSuggestionItemProps', getSuggestionItemProps) */}
                    return (
                        <div className="Demo__search-bar-container input-style row" key={Math.random()}>
                            <div className="Demo__search-input-container row">
                                <input
                                    {...getInputProps({
                                        placeholder: 'Search Address...',
                                        className: 'Demo__search-input',
                                    })}
                                    autoFocus={focusFlag}
                                    disabled={disabledInput}
                                />
                                {address?.length > 0 && disabledInput === false && (
                                    <button
                                        className="Demo__clear-button"
                                        onClick={handleCloseClick}
                                    >
                                        x
                                    </button>
                                )}
                            </div>

                            {suggestions.length > 0 && (
                                <div style={{ backgroundColor: "white", paddingTop: "2px" }} >
                                    {suggestions.map((suggestion, ind) => {
                                        {/* const className = classnames('Demo__suggestion-item', {
                                            'Demo__suggestion-item--active': suggestion.active,
                                        }); */}

                                        return (
                                            /* eslint-disable react/jsx-key */
                                            <div key={ind} style={{ marginBottom: "2px", backgroundColor: "white" }}>
                                                <div
                                                    {...getSuggestionItemProps(suggestion)}
                                                >
                                                    <strong>
                                                        {suggestion.formattedSuggestion.mainText}
                                                    </strong>{' '}
                                                    <small>
                                                        {suggestion.formattedSuggestion.secondaryText}
                                                    </small>
                                                </div>
                                                <hr />
                                            </div>
                                        );
                                        /* eslint-enable react/jsx-key */
                                    })}
                                    <div className="Demo__dropdown-footer">
                                        <div>
                                            {/* <img
                                                    src={require('../images/powered_by_google_default.png')}
                                                    className="Demo__dropdown-footer-image"
                                                /> */}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }}
            </PlacesAutocomplete>
            {errorMessage.length > 0 && (
                <div className="Demo__error-message">{errorMessage}</div>
            )}

            {/* {((latitude && longitude) || isGeocoding) && (
                <div>
                    <h3 className="Demo__geocode-result-header">Geocode result</h3>
                    {isGeocoding ? (
                        <div>
                            <i className="fa fa-spinner fa-pulse fa-3x fa-fw Demo__spinner" />
                        </div>
                    ) : (
                            <div>
                                <div className="Demo__geocode-result-item--lat">
                                    <label>Latitude:</label>
                                    <span>{latitude}</span>
                                </div>
                                <div className="Demo__geocode-result-item--lng">
                                    <label>Longitude:</label>
                                    <span>{longitude}</span>
                                </div>
                            </div>
                        )}
                </div>
            )} */}
        </div>
    )
}