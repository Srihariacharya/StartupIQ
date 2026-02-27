import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const DAILY_LIMIT = 5;

export const useUsageLimit = () => {
    const { user } = useContext(AuthContext);

    // State for limit tracking
    const [usageCount, setUsageCount] = useState(0);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);

    useEffect(() => {
        // If the user is logged in, they bypass the limit
        if (user) {
            setIsLimitReached(false);
            return;
        }

        const today = new Date().toDateString();

        // Check local storage for existing usage data
        const storedData = localStorage.getItem('startup_iq_usage');
        let currentUsage = { date: today, count: 0 };

        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                // If the stored date is today, keep the count. Otherwise it resets.
                if (parsed.date === today) {
                    currentUsage = parsed;
                }
            } catch (e) {
                console.error("Error parsing usage limit:", e);
            }
        }

        setUsageCount(currentUsage.count);

        if (currentUsage.count >= DAILY_LIMIT) {
            setIsLimitReached(true);
        }
    }, [user]);

    // Call this function when a user attempts a core action
    const checkAndIncrementUsage = () => {
        // Logged in users bypass the limit entirely
        if (user) return true;

        if (isLimitReached) {
            setShowLimitModal(true);
            return false; // Action blocked
        }

        // Increment usage
        const newCount = usageCount + 1;
        setUsageCount(newCount);

        const today = new Date().toDateString();
        localStorage.setItem('startup_iq_usage', JSON.stringify({
            date: today,
            count: newCount
        }));

        if (newCount >= DAILY_LIMIT) {
            setIsLimitReached(true);
        }

        return true; // Action allowed
    };

    const closeLimitModal = () => setShowLimitModal(false);

    return {
        usageCount,
        remainingActions: Math.max(0, DAILY_LIMIT - usageCount),
        isLimitReached,
        checkAndIncrementUsage,
        showLimitModal,
        closeLimitModal
    };
};
