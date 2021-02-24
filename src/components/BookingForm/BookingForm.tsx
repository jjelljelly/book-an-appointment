import { useState, useEffect } from 'react'
import PayPal from '../Paypal/PayPal'
import './BookingForm.css'

interface Props {
    setStage: (stage: number) => void,
    selectedTime: string,
    handleSubmit: (firstName: string, lastName: string, telephone: string, email: string, address: string, mop: string, policy: string, auth: string, dob: string, gp: string, privacy: boolean, payInClinic: boolean) => void,
    type: string
}

const BookingForm: React.FC<Props> = (props) => {
    const selectedDate = new Date(props.selectedTime).toString()
    console.log(selectedDate)

    //form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [address, setAddress] = useState('');
    const [mop, setMop] = useState('');
    const [dob, setDob] = useState('');
    const [policy, setPolicy] = useState('');
    const [auth, setAuth] = useState('');
    const [gpAddress, setGpAddress] = useState('');
    const [payInClinic, setPayInClinic] = useState(false);
    const [privacy, setPrivacy] = useState(false);

    //Google autocomplete for addresses
    const [googleLoad, setGoogleLoad] = useState<boolean>(false);
    const renderGoogle = () => {
        setGoogleLoad(true)
        let autocomplete: any;
        const google = window.google;
        const auto: any = document.getElementById('autocomplete');
        autocomplete = new google.maps.places.Autocomplete(auto, {})

        let handlePlaceSelect = () => {
            let addressObject = autocomplete.getPlace();
            let address = addressObject.address_components;

            autocomplete.setFields(['address_component']);
            let textAddress = '';
            address.map((part: any, i: number) => {
                textAddress += part['long_name']
                if (i < address.length - 1) {
                    textAddress += ', '
                }
                return '';
            })
            setAddress(textAddress)
        }
        autocomplete.addListener("place_changed", handlePlaceSelect)

        let autoGP: any;
        const gpAuto: any = document.getElementById('GP');
        autoGP = new google.maps.places.Autocomplete(gpAuto, {})

        let handleGpPlaceSelect = () => {
            let addressObject = autoGP.getPlace();
            let address = addressObject.address_components;

            autoGP.setFields(['address_component']);
            let textAddress = '';
            address.map((part: any, i: number) => {
                textAddress += part['long_name']
                if (i < address.length - 1) {
                    textAddress += ', '
                }
                return '';
            })
            setGpAddress(textAddress)
        }
        autoGP.addListener("place_changed", handleGpPlaceSelect)
    }

    useEffect(() => {
        if (googleLoad === false) {
            const script = document.createElement("script");
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAkuPHNHz8Ki1KV6n6iI1-EFVIC3ZAm0QY&libraries=places";
            script.async = true;
            script.onload = () => renderGoogle();
            document.body.appendChild(script);
        }
    }, [googleLoad])

    //prevent form default during handle submit if client is using health insurance
    const formSub = (e: any) => {
        e.preventDefault()
        theSubmission()
    }

    //handle submit if paypal is used
    const theSubmission = () => {
        props.handleSubmit(firstName, lastName, telephone, email, address, mop, policy, auth, dob, gpAddress, privacy, payInClinic)
    }

    //if they have opted to pay in clinic, submit the form
    useEffect(() => {
        payInClinic && theSubmission()
    })

    //determine price
    const [price, setPrice] = useState<number>(0);
    useEffect(() => {
        console.log(props.type)
        props.type === 'KN-NP' ? setPrice(200) :
            props.type === 'KN-FU' ? setPrice(130) :
                props.type === 'ST-NP' ? setPrice(120) :
                    props.type === 'ST-FU' && setPrice(90)
    }, [price, props.type])

    return (
        <div className="books">
            <div className='bookingContainer'>
                <div className='atBanner'>
                    <h1 className="portal-title" style={{marginTop: '40px'}}>Appointment Booking Form</h1>
                    <p>You have selected {selectedDate.split(':00 GMT')[0]}</p>
                </div>
                <hr className='hr' />

                <form 
                    className='bookingForm' 
                    onSubmit={(e: any) => formSub(e)}
                    >
                    <label>
                        <div className='bookingLabel'>First Name:</div> <div className='requiredIcon'>*</div>
                        <br />
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
                    </label>
                    <label>
                        <div className='bookingLabel'>Last Name:</div> <div className='requiredIcon'>*</div>
                        <br />
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
                    </label>
                    <label>
                        <div className='bookingLabel'>Date of Birth:</div> <div className='requiredIcon'>*</div>
                        <br />
                        <input type="date" style={{WebkitAppearance: 'button'}} value={dob} onChange={(e) => setDob(e.target.value)} required />
                    </label>
                    <label>
                        <div className='bookingLabel'>Telephone:</div> <div className='requiredIcon'>*</div>
                        <br />
                        <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Mobile Number" required />
                    </label>
                    <label>
                        <div className='bookingLabel'>Email:</div> <div className='requiredIcon'>*</div>
                        <br />
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. example@example.com" required />
                    </label>
                    <label>
                        <div className='bookingLabel'>Address:</div> <div className='requiredIcon'>*</div>
                        <br />
                        <input id="autocomplete" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your Home Address" required />
                    </label>
                    <label>
                        <div className='bookingLabel'>Method of Payment:</div> <div className='requiredIcon'>*</div>
                        <br />
                        <select name="mop" value={mop} onChange={(e) => setMop(e.target.value)}>
                            <option value=''>-Select-</option>
                            <option value="self-funding">Self-funding</option>
                            <option value="aetna">Aetna</option>
                            <option value="allianz">Allianz</option>
                            <option value="bupa">Bupa</option>
                            <option value="aviva">Aviva</option>
                            <option value="axa-ppp">AXA PPP</option>
                            <option value="axa-ppp-international">AXA PPP International</option>
                            <option value="cigna">Cigna</option>
                            <option value="cigna-international">Cigna International</option>
                            <option value="exeter-friendly">Exeter Friendly</option>
                            <option value="healix">Healix</option>
                            <option value="simply-health">Simply Health</option>
                            <option value="vitality">Vitality</option>
                            <option value="wpa">WPA</option>
                        </select>
                    </label>
                        {
                            mop !== 'self-funding' && mop !== '' ? 
                            <>
                            <hr className="divider" />
                                <label>
                                    <div className='bookingLabel'>Policy Number:</div>
                                    <br />
                                    <input type="text" value={policy} onChange={(e) => setPolicy(e.target.value)} placeholder="Also known as membership number" />
                                </label>
                                <label>
                                    <div className='bookingLabel'>Authorisation:</div>
                                    <br />
                                    <input type="text" value={auth} onChange={(e) => setAuth(e.target.value)} placeholder="Issued by your insurance provider" />
                                </label>
                            <hr className="divider" />
                            </> :
                                mop === 'self-funding' &&
                                    <>
                                    <hr className="divider" />
                                        <div style={{fontSize: '14px', width: '90%', margin: 'auto'}}>
                                            The appointment fee is £{price}.<br /><br />
                                            When you submit the form you can opt to either pay now or pay in clinic.
                                        </div>
                                    <hr className="divider" />
                                    </>
                        }
                    <label>
                    <label>
                        <div className='bookingLabel'>GP Address:</div> <div className='requiredIcon'>*</div>
                        <br />
                        <input id="GP" type="text" value={gpAddress} onChange={(e) => setGpAddress(e.target.value)} placeholder="Your General Practitioner's Address" required />
                    </label>
                        <div className='bookingLabel'>Privacy:</div> <div className='requiredIcon'>*</div>
                        <br />
                        <div className="checkbox-alignment">
                            <input 
                                name="privacy" 
                                type="checkbox" 
                                style={{appearance: 'auto', WebkitAppearance: 'checkbox', width: '30px', border: '1px solid var(--the-black)', margin: '0 15px'}}
                                checked={privacy} 
                                onChange={() => setPrivacy(!privacy)} 
                                required 
                                />
                            <p>By ticking this box you indicate that you have read and agree with our<a href="https://www.londonfootandanklesurgery.co.uk/about-us/privacy-policy/" target="_blank" rel="noreferrer">&nbsp;Privacy Policy&nbsp;</a></p>
                        </div>
                    </label>
                    {
                        (mop === 'self-funding' && privacy) ? 
                            <>
                                <input 
                                    className='submitButton' 
                                    type="submit" 
                                    onClick={() => setPayInClinic(true)} 
                                    value="Pay In Clinic" 
                                    />
                                <div className="paypal-container">
                                    <PayPal 
                                        price={price}
                                        description={
                                            "Consultation with " + 
                                            (props.type.indexOf('KN') >= 0 ? "Mr. Kaser Nazir, Consultant Podiatric Surgeon" : "Mr. Steven Thomas, Specialist Podiatrist")
                                        }
                                        paySubmit={() => theSubmission()}
                                        />
                                </div> 
                            </> : 
                                    <input className='submitButton' type="submit" value="Submit" />
                    }
                </form>
            </div>
            <button
                className="back-to-calendar"
                onClick={() => props.setStage(1)}
                >
                  Select A Different Time
            </button> 
            <button
                className="back-to-calendar"
                onClick={() => props.setStage(0)}
                >
                  Choose A Different Appointment Type
            </button> 
        </div>
    )
}

export default BookingForm