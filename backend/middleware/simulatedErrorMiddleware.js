export default function simulatedErrorMiddleware(req, res, next) {
    const errorChance = 0.1; // 10% šance na chybu, může se upravit podle potřeby
    const shouldFail = Math.random() < errorChance;

    if (shouldFail) {
        return res.status(500).json({
            message: 'Simulovaná chyba serveru. Zkuste akci zopakovat.',
        });
    }

    next();
}