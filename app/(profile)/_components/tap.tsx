import React, { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface TabsProps {
    children: ReactNode[];
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-6 border-b">
                {children.map((child, index) => {
                    if (React.isValidElement(child)) {
                        return (
                            <button
                                key={index}
                                className={`relative py-3 px-6 text-sm font-medium rounded-t-lg 
                                    transition-all duration-200 focus:outline-none
                                    ${activeTab === index
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"}`}
                                onClick={() => setActiveTab(index)}
                            >
                                {child.props.label}
                                {activeTab === index && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                        layoutId="activeTab"
                                        initial={false}
                                    />
                                )}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>
            <motion.div
                className="min-h-[200px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                key={activeTab}
            >
                {children[activeTab]}
            </motion.div>
        </div>
    );
};

export default Tabs;