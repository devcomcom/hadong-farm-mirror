import { useState } from "react";

const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex space-x-4 border-b">
                {children.map((child, index) => (
                    <button
                        key={index}
                        className={`py-2 px-4 focus:outline-none ${activeTab === index ? "border-b-2 border-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {child.props.label}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                {children[activeTab]}
            </div>
        </div>
    );
};

export default Tabs;