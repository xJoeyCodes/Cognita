# Vendor

This folder contains third-party libraries, code, and submodules that are not managed by package managers.

## Contents

### Self-Contained Libraries
- **Custom implementations**: Modified or extended third-party code
- **Legacy dependencies**: Older libraries not available via npm
- **Proprietary modules**: Licensed third-party components
- **Submodules**: Git submodules for external dependencies

### Licensing Requirements
All vendor code must include:
- **License files**: Original license documentation
- **Attribution**: Proper credit to original authors
- **Usage rights**: Clear permissions for use in this project
- **Compatibility**: Ensure compatibility with project license (MIT)

## Organization

```
vendor/
├── licenses/
│   ├── library1-license.txt
│   ├── library2-license.txt
│   └── README.md
├── libraries/
│   ├── custom-module/
│   ├── legacy-dependency/
│   └── proprietary-component/
└── submodules/
    ├── external-repo1/
    └── external-repo2/
```

## Usage Guidelines

### Adding Vendor Code
1. **Verify licensing**: Ensure code is compatible with MIT license
2. **Document source**: Include original repository/author information
3. **Add attribution**: Credit original creators appropriately
4. **Update licenses**: Add license information to licenses/ folder

### Maintenance
- **Regular updates**: Keep vendor code up to date
- **Security patches**: Apply security updates promptly
- **License compliance**: Ensure ongoing license compliance
- **Documentation**: Maintain clear documentation of all vendor code

### Integration
- **Import paths**: Use clear, consistent import paths
- **Dependencies**: Document any additional dependencies
- **Configuration**: Provide clear configuration options
- **Testing**: Include vendor code in testing procedures

## Current Vendor Dependencies

### None Currently
This project primarily uses npm-managed dependencies. Vendor folder is prepared for future self-contained libraries or submodules.

## License Compliance

All vendor code must be:
- **Properly licensed**: Compatible with project's MIT license
- **Attributed**: Credit given to original authors
- **Documented**: Clear documentation of usage rights
- **Maintained**: Regular updates and security patches

## Adding New Vendor Code

### Before Adding
1. **License check**: Verify compatibility with MIT license
2. **Source verification**: Confirm code authenticity and safety
3. **Documentation**: Prepare proper attribution and documentation
4. **Integration plan**: Plan how to integrate with existing code

### After Adding
1. **Update documentation**: Add to this README
2. **License file**: Add license information to licenses/
3. **Attribution**: Update ACKNOWLEDGEMENTS.md
4. **Testing**: Ensure integration works correctly

## Security Considerations

- **Code review**: Thoroughly review all vendor code
- **Security scanning**: Scan for vulnerabilities
- **Updates**: Keep vendor code updated
- **Monitoring**: Monitor for security issues

## Contact

For questions about vendor code or to add new dependencies, contact [your.email@example.com].
