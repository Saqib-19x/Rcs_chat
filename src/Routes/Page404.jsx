import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import image404 from '../assets/404.png'

export default function PageNotFound() {
    return (
        <Fragment>
            <div className="flex flex-col border flex-wrap justify-center items-center min-h-screen bg-gray-100">
                <div className="hidden md:block md:w-1/2 xl:w-2/3">
                    <img src={image404} alt="404 Image" className="w-4/12 m-auto h-full object-cover" />
                </div>
                <div className="md:w-1/2 xl:w-1/3 text-center">
                    <h1 className="text-9xl font-bold text-gray-800">404</h1>
                    <p className="text-2xl font-bold mt-6 text-gray-600">
                        Page Not Found
                    </p>
                    <div className="mt-12 text-center">
                        <p className="text-gray-600 font-semibold">
                            We are sorry, the page you requested could not be found.
                        </p>
                        <p className="text-gray-600 font-semibold">
                            Please go back to the homepage.
                        </p>
                        <div className="w-full flex justify-center mt-2">
                            <Link to={'/userdashboard'}>
                                <Button className="mt-4 px-4 py-2 font-bold rounded-md">
                                    Go To Dashboard
                                </Button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}
