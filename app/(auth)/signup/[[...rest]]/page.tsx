import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex justify-center items-center h-screen">
            <SignUp
                appearance={{
                    layout: {
                        socialButtonsVariant: "iconButton",
                        termsPageUrl: "/terms",
                    },
                    elements: {
                        formButtonPrimary: {
                            fontSize: 14,
                            textTransform: 'none',
                            backgroundColor: '#611BBD',
                            '&:hover, &:focus, &:active': {
                                backgroundColor: '#49247A',
                            },
                        },
                    },
                }}
            />
        </div>

    );
}
