async function getWizardChad(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/login')
        return
    }


    await ctx.defaultRender('wizardChad', 'WizardChad', null)
}

module.exports = {
    getWizardChad
};