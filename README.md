## Application description

-   The application is available at https://silofit-back.firebaseapp.com

-   The application supports multiple domains. Currently, only gmail.com is registered, but feel free to register more domains by calling the http functions https://us-central1-silofit-back.cloudfunctions.net/registerDomain?domain=_XXX.com_

-   The available weekly slots definitions are actually dynamic, even though currently all registered domains will use the definitions provided in the exercice description; this would allow for a future management API (not implemented at the moment).

-   Sessions for a specific domain are created on the fly whenever a user from the domain logs in. They are retrieved (and generated if necessary) based on the domain's slots definitions for the upcoming month.

-   Currently, all users with an email address containing _+admin_ are considered admins.

-   Access codes are generated directly from the application, using the _Generate access code_ button with an admin account.

-   The waitlist for a given session is calculated on the fly, meaning that it can be adjusted real-time just by changing the _maxAttendees_ value for a given session.

## Things to improve

-   At the moment, I have an odd behavior in the front-end that I was not able to fix: only 1 session action button can be clicked, after which no button is active any longer (the onClick event does not even get called and the page freezes). Right now, I implemented an ugly hack which consists in a full page refresh, which is definitely not what we want to see. I suspect that this is probably due to the organisation of my react components.

-   I am not entirely happy with the models for the functions. In a "real life" scenario, I would probably rework those to use a generic DbEntity<T>: {key: string, value: T} type with methods allowing to switch from RTDB objects ({[key: string]: T}) to more API friendly objects ({key: string ...T}).

-   Models should be exported in a library so they can be shared between the back-end and the font-end

## Database structure

The realtime database is structured as follow, in order to be able to accomodate several domains in the same database:

-   Domains:

    -   [key: UUID]:
        -   domain: string
        -   slots:
            -   [key: UUID]:
                -   day: [0-6]
                -   start: string
                -   end: string
                -   maxAttendees: number
        -   sessions:
            -   [key: 'YYYY-MM-DD-start-end']:
                -   date: string
                -   start: string
                -   end: string
                -   code?: string
                -   maxAttendees: number
                -   attendees?: string[]

-   Users:

    -   [key: UUID]:

        -   email: string
        -   isAdmin: boolean
