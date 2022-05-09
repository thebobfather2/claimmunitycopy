import React, {useState} from "react";
import Stripe from "react-stripe-checkout";
import PaymentDataService from "../../api/PaymentDataService";
import AuthenticationService, {USER_NAME_SESSION_ATTRIBUTE_NAME} from "../../api/AuthenticationService";
import {STRIPE_LIVE_KEY} from "../../Constants";
import LoadingIcons from 'react-loading-icons'

function StripeCheckoutComponent(props) {

    const [loading, setLoading] = useState(false)

    async function createSubscription(token) {
        setLoading(true)
        await PaymentDataService.createSubscription({
            token: token.id,
            subscriptionQuantity: props.match.params.licenses,
            emailAddress: sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME),
            subscriptionMethod: 'MONTHLY'

        }, token, props.match.params.licenses)
            .then(() => {
                alert("Payment was successful");
            })
            .then(() => AuthenticationService.updateUserToPremium())
            .then(() => props.history.push('/settings/organization'))
            .then(() => setLoading(false))
            .catch((error) => {
                alert(error);
                setLoading(false);
            });
    }

    return (
        // <div className="Stripe">
        //     <Stripe>
        //     <StripeCheckout stripeKey="pk_test_51HnXgDH1jw4GXTTwojegvfSk6FcyGMT8aIIwQIFQyk2venk8dd1YvQGhrVNqwaFOTvPfj48ZInkJQoReyjziyKYz00IqkQez97"
        //                     token={handleToken}
        //                     name="" billingAddress />
        //     </Stripe>
        // </div>

        <div>

            <div className="Stripe">

                {loading && <div className="loading">
                    <LoadingIcons.Bars stroke="#317ABB" speed="0.75"/>
                </div>}

                {!loading && <Stripe
                    stripeKey={STRIPE_LIVE_KEY}
                    token={createSubscription} name={createSubscription}
                />}
            </div>
        </div>

    );
}

export default StripeCheckoutComponent;